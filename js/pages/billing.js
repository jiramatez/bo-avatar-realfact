/* ================================================================
   Page Module — Billing & Payments
   ================================================================ */

window.Pages = window.Pages || {};
window.Pages.billing = {

  // ─── Helper: re-render page ───
  _rerender(activeTab) {
    const ct = document.getElementById('content');
    ct.innerHTML = window.Pages.billing.render();
    window.Pages.billing.init(activeTab);
  },

  // ─── Helper: escape CSV cell ───
  _csvCell(val) {
    if (val == null) return '';
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"` : str;
  },

  render() {
    const d = window.MockData;
    const invoices = d.invoices;
    const purchaseLog = d.purchaseLog;
    const creditLines = d.creditLines || [];
    const creditLineRequests = d.creditLineRequests || [];
    const refundRequests = d.refundRequests || [];
    const agingReport = d.agingReport || [];
    const collectionNotices = d.collectionNotices || [];

    const pendingCount = invoices.filter(i => i.status === 'Issued' || i.status === 'Pending').length;
    const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
    const verificationCount = invoices.filter(i => i.status === 'Pending Verification').length;
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
    const pendingVerifications = invoices.filter(i => i.status === 'Pending Verification');

    // unique sub-platform and type values for purchase log filters
    const subPlatforms = [...new Set(purchaseLog.map(p => p.subPlatform))];
    const logTypes = [...new Set(purchaseLog.map(p => p.type))];
    const logStatuses = [...new Set(purchaseLog.map(p => p.status))];

    return `
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="heading">BILLING & PAYMENTS</h1>
      </div>

      <!-- Stats Row -->
      <div class="grid-4 mb-20">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">รายได้รายเดือน</span>
            <div class="stat-icon green"><i class="fa-solid fa-baht-sign"></i></div>
          </div>
          <div class="stat-value mono">${d.formatCurrency(totalRevenue)}</div>
          <div class="stat-change up"><i class="fa-solid fa-arrow-up"></i> +8% จากเดือนก่อน</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">ใบแจ้งหนี้รอชำระ</span>
            <div class="stat-icon yellow"><i class="fa-solid fa-file-invoice"></i></div>
          </div>
          <div class="stat-value mono">${pendingCount}</div>
          <div class="stat-change down">รอดำเนินการ</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">ค้างชำระ</span>
            <div class="stat-icon red"><i class="fa-solid fa-triangle-exclamation"></i></div>
          </div>
          <div class="stat-value mono">${overdueCount}</div>
          <div class="stat-change down"><i class="fa-solid fa-arrow-down"></i> ต้องติดตาม</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">รอตรวจสอบการชำระ</span>
            <div class="stat-icon orange"><i class="fa-solid fa-clipboard-check"></i></div>
          </div>
          <div class="stat-value mono">${verificationCount}</div>
          <div class="stat-change down">รอยืนยันสลิป</div>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar mb-20">
        <div class="tab-item active" data-tab="invoices"><i class="fa-solid fa-file-invoice"></i> ใบแจ้งหนี้</div>
        <div class="tab-item" data-tab="purchase-log"><i class="fa-solid fa-clock-rotate-left"></i> ประวัติการซื้อ</div>
        <div class="tab-item" data-tab="verification"><i class="fa-solid fa-clipboard-check"></i> ตรวจสอบการชำระ</div>
        <div class="tab-item" data-tab="credit-lines"><i class="fa-solid fa-credit-card"></i> วงเงินเครดิต</div>
        <div class="tab-item" data-tab="refunds"><i class="fa-solid fa-rotate-left"></i> คืนเงิน</div>
        <div class="tab-item" data-tab="aging"><i class="fa-solid fa-calendar-xmark"></i> ค้างชำระ</div>
      </div>

      <!-- Tab: Invoices -->
      <div id="tab-invoices" class="billing-tab-content">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>เลขที่ใบแจ้งหนี้</th>
                <th>TENANT</th>
                <th>ประเภท</th>
                <th>รายละเอียด</th>
                <th>จำนวนเงิน</th>
                <th>VAT</th>
                <th>รวมทั้งสิ้น</th>
                <th>สถานะ</th>
                <th>วันครบกำหนด</th>
                <th>ช่องทาง</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td class="mono text-sm">${inv.id}</td>
                  <td class="font-600">${inv.tenantName}</td>
                  <td>${inv.type === 'Token Top-up' ? '<span class="chip chip-orange">Token Top-up</span>' : '<span class="chip chip-blue">Subscription</span>'}</td>
                  <td class="text-sm">${inv.description}</td>
                  <td class="mono">${d.formatCurrency(inv.amount)}</td>
                  <td class="mono text-sm">${d.formatCurrency(inv.vat)}</td>
                  <td class="mono font-600">${d.formatCurrency(inv.total)}</td>
                  <td>${d.statusChip(inv.status)}</td>
                  <td class="text-sm text-muted">${inv.dueDate}</td>
                  <td class="text-sm">${inv.method || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Purchase Log -->
      <div id="tab-purchase-log" class="billing-tab-content hidden">
        <!-- Filters & Export Bar -->
        <div class="flex items-center gap-12 mb-16" style="flex-wrap:wrap;">
          <div class="form-group" style="margin:0;min-width:160px;">
            <select id="pl-filter-platform" class="form-input">
              <option value="">Sub-Platform ทั้งหมด</option>
              ${subPlatforms.map(sp => `<option value="${sp}">${sp}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin:0;min-width:160px;">
            <select id="pl-filter-type" class="form-input">
              <option value="">ประเภททั้งหมด</option>
              ${logTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin:0;min-width:160px;">
            <select id="pl-filter-status" class="form-input">
              <option value="">สถานะทั้งหมด</option>
              ${logStatuses.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div class="flex gap-8 ml-auto">
            <button class="btn btn-outline btn-sm" id="pl-export-csv"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
            <button class="btn btn-outline btn-sm" id="pl-export-pdf"><i class="fa-solid fa-file-pdf"></i> Export PDF</button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>TENANT</th>
                <th>SUB-PLATFORM</th>
                <th>ประเภท</th>
                <th>รายละเอียด</th>
                <th>ช่องทาง</th>
                <th>จำนวนเงิน</th>
                <th>สถานะ</th>
                <th>อ้างอิง</th>
              </tr>
            </thead>
            <tbody id="pl-table-body">
              ${purchaseLog.map(p => `
                <tr data-platform="${p.subPlatform}" data-type="${p.type}" data-status="${p.status}">
                  <td class="text-sm text-muted">${p.date}</td>
                  <td class="font-600">${p.tenantName}</td>
                  <td class="text-sm">${p.subPlatform}</td>
                  <td>${p.type === 'Token Top-up' ? '<span class="chip chip-orange">Token Top-up</span>' : '<span class="chip chip-blue">Subscription</span>'}</td>
                  <td class="text-sm">${p.description}</td>
                  <td class="text-sm">${p.method}</td>
                  <td class="mono font-600">${d.formatCurrency(p.amount)}</td>
                  <td>${d.statusChip(p.status)}</td>
                  <td class="mono text-xs">${p.ref}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Payment Verification -->
      <div id="tab-verification" class="billing-tab-content hidden">
        ${pendingVerifications.length === 0
          ? '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><p>ไม่มีรายการรอตรวจสอบ</p></div>'
          : `<div class="grid-2 gap-16">
              ${pendingVerifications.map(inv => `
                <div class="card-accent p-20">
                  <div class="flex justify-between items-center mb-12">
                    <div class="mono font-600 text-sm">${inv.id}</div>
                    ${d.statusChip(inv.status)}
                  </div>
                  <div class="flex-col gap-8 mb-16">
                    <div class="flex justify-between">
                      <span class="text-sm text-muted uppercase">Tenant</span>
                      <span class="font-600">${inv.tenantName}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-muted uppercase">จำนวนเงิน</span>
                      <span class="mono font-700" style="font-size:18px;color:var(--primary);">${d.formatCurrency(inv.total)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-muted uppercase">ช่องทาง</span>
                      <span class="text-sm">${inv.method || 'Bank Transfer'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-muted uppercase">วันครบกำหนด</span>
                      <span class="text-sm mono">${inv.dueDate}</span>
                    </div>
                  </div>

                  <!-- Upload Slip Area -->
                  <div class="card p-16 mb-16" style="border-style:dashed;">
                    <div class="flex-col items-center gap-8">
                      <i class="fa-solid fa-receipt text-muted" style="font-size:24px;"></i>
                      <div class="text-sm text-muted">สลิปการโอนเงิน</div>
                      <div class="text-xs text-muted">อัปโหลดโดย Tenant</div>
                      <span class="chip chip-yellow">รอตรวจสอบ</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-10 justify-end">
                    <button class="btn btn-danger btn-sm verify-reject-btn" data-id="${inv.id}"><i class="fa-solid fa-xmark"></i> ปฏิเสธ</button>
                    <button class="btn btn-success btn-sm verify-approve-btn" data-id="${inv.id}"><i class="fa-solid fa-check"></i> อนุมัติ</button>
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </div>

      <!-- Tab: Credit Line (วงเงินเครดิต) -->
      <div id="tab-credit-lines" class="billing-tab-content hidden">

        <!-- Credit Line Requests -->
        ${creditLineRequests.length > 0 ? `
          <div class="card p-20 mb-20" style="border-left:3px solid var(--warning);">
            <div class="text-sm uppercase text-muted font-600 mb-12">
              <i class="fa-solid fa-bell text-warning"></i> คำขอวงเงินเครดิตใหม่ (${creditLineRequests.length} รายการ)
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TENANT</th>
                    <th>วงเงินที่ขอ</th>
                    <th>เอกสาร</th>
                    <th>วันที่ขอ</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  ${creditLineRequests.map(req => `
                    <tr>
                      <td class="mono text-sm">${req.id}</td>
                      <td class="font-600">${req.tenantName}</td>
                      <td class="mono font-600">${d.formatCurrency(req.requestedLimit)}</td>
                      <td class="text-sm">${req.documents} ไฟล์</td>
                      <td class="text-sm text-muted">${req.requestDate}</td>
                      <td>${d.statusChip(req.status)}</td>
                      <td>
                        <button class="btn btn-success btn-sm cl-approve-req-btn" data-id="${req.id}"><i class="fa-solid fa-check"></i> อนุมัติ</button>
                        <button class="btn btn-danger btn-sm cl-reject-req-btn ml-4" data-id="${req.id}"><i class="fa-solid fa-xmark"></i> ปฏิเสธ</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- Active Credit Lines -->
        <div class="text-sm uppercase text-muted font-600 mb-12">วงเงินเครดิตที่อนุมัติแล้ว</div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TENANT</th>
                <th>วงเงินสูงสุด</th>
                <th>ใช้ไปแล้ว</th>
                <th>คงเหลือ</th>
                <th>การใช้งาน</th>
                <th>รอบบิล</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              ${creditLines.map(cl => {
                const usedPct = Math.min(100, Math.round(cl.usedAmount / cl.creditLimit * 100));
                const barColor = usedPct > 80 ? 'var(--error)' : usedPct > 50 ? 'var(--warning)' : 'var(--success)';
                return `
                  <tr>
                    <td class="mono text-sm">${cl.id}</td>
                    <td class="font-600">${cl.tenantName}</td>
                    <td class="mono">${d.formatCurrency(cl.creditLimit)}</td>
                    <td class="mono text-warning">${d.formatCurrency(cl.usedAmount)}</td>
                    <td class="mono text-success">${d.formatCurrency(cl.availableCredit)}</td>
                    <td style="min-width:120px;">
                      <div class="progress-bar" style="margin-bottom:4px;">
                        <div class="progress-fill" style="width:${usedPct}%;background:${barColor};"></div>
                      </div>
                      <span class="text-xs text-muted">${usedPct}% ใช้ไป</span>
                    </td>
                    <td class="text-sm">${cl.billingCycle} วัน</td>
                    <td>${d.statusChip(cl.status)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Refund & Dispute (คืนเงิน) -->
      <div id="tab-refunds" class="billing-tab-content hidden">
        ${refundRequests.length === 0
          ? '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><p>ไม่มีคำขอคืนเงิน</p></div>'
          : `<div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TENANT</th>
                    <th>ใบแจ้งหนี้</th>
                    <th>จำนวนเงิน</th>
                    <th>เหตุผล</th>
                    <th>สถานะ</th>
                    <th>การอนุมัติ (Dual)</th>
                    <th>วันที่ขอ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  ${refundRequests.map(r => `
                    <tr>
                      <td class="mono text-sm">${r.id}</td>
                      <td class="font-600">${r.tenantName}</td>
                      <td class="mono text-sm">${r.invoiceId}</td>
                      <td class="mono font-600">${d.formatCurrency(r.amount)}</td>
                      <td class="text-sm">${r.reason}</td>
                      <td>${d.statusChip(r.status)}</td>
                      <td>
                        <div class="flex gap-6 items-center">
                          <span class="chip ${r.superAdminApproved ? 'chip-green' : 'chip-gray'}" title="Super Admin">
                            <i class="fa-solid fa-shield-halved"></i> ${r.superAdminApproved ? '✓' : '✗'}
                          </span>
                          <span class="chip ${r.financeApproved ? 'chip-green' : 'chip-gray'}" title="Finance">
                            <i class="fa-solid fa-coins"></i> ${r.financeApproved ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td class="text-sm text-muted">${r.requestDate}</td>
                      <td>
                        ${!r.superAdminApproved || !r.financeApproved ? `
                          <button class="btn btn-success btn-sm refund-approve-btn" data-id="${r.id}">
                            <i class="fa-solid fa-check"></i> อนุมัติ
                          </button>
                        ` : `<span class="chip chip-green">สมบูรณ์</span>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`
        }
      </div>

      <!-- Tab: Aging Report (รายงานค้างชำระ) -->
      <div id="tab-aging" class="billing-tab-content hidden">
        ${agingReport.length === 0
          ? '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><p>ไม่มีรายการค้างชำระ</p></div>'
          : `
            <!-- Aging Report Table -->
            <div class="section-title mb-12"><i class="fa-solid fa-calendar-xmark"></i> รายงานค้างชำระ</div>
            <div class="table-wrap mb-20">
              <table>
                <thead>
                  <tr>
                    <th>TENANT</th>
                    <th>ยอดค้างชำระ</th>
                    <th>จำนวนวัน</th>
                    <th>จำนวนใบแจ้งหนี้</th>
                    <th>แจ้งเตือนล่าสุด</th>
                    <th>สถานะเครดิต</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  ${agingReport.map(row => {
                    const notice = collectionNotices.find(n => n.tenantId === row.tenantId);
                    let cooldownDays = 0;
                    let inCooldown = false;
                    if (notice && notice.cooldownUntil) {
                      const cooldownDate = new Date(notice.cooldownUntil);
                      const today = new Date('2026-03-03');
                      const diff = Math.ceil((cooldownDate - today) / 86400000);
                      if (diff > 0) {
                        inCooldown = true;
                        cooldownDays = diff;
                      }
                    }
                    return `
                      <tr>
                        <td class="font-600">${row.tenantName}</td>
                        <td class="mono font-600 text-error">${d.formatCurrency(row.totalOverdue)}</td>
                        <td>
                          <span class="chip ${row.daysOverdue > 30 ? 'chip-red' : row.daysOverdue > 14 ? 'chip-orange' : 'chip-yellow'}">
                            ${row.daysOverdue} วัน
                          </span>
                        </td>
                        <td class="mono text-center">${row.invoiceCount}</td>
                        <td class="text-sm text-muted">${row.lastNotice || '-'}</td>
                        <td>${d.statusChip(row.creditStatus)}</td>
                        <td>
                          ${inCooldown
                            ? `<button class="btn btn-outline btn-sm" disabled title="Cooldown อีก ${cooldownDays} วัน">
                                <i class="fa-solid fa-clock"></i> อีก ${cooldownDays} วัน
                               </button>`
                            : `<button class="btn btn-primary btn-sm send-notice-btn" data-id="${row.tenantId}">
                                <i class="fa-solid fa-envelope"></i> ส่งใบทวงหนี้
                               </button>`
                          }
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Collection Notices Table -->
            <div class="divider mb-16"></div>
            <div class="section-title mb-12"><i class="fa-solid fa-envelope"></i> ประวัติใบทวงหนี้</div>
            ${collectionNotices.length === 0
              ? '<div class="text-sm text-muted">ยังไม่มีประวัติใบทวงหนี้</div>'
              : `<div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>TENANT</th>
                        <th>ใบแจ้งหนี้</th>
                        <th>จำนวน</th>
                        <th>วันที่ส่ง</th>
                        <th>ช่องทาง</th>
                        <th>Cooldown</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${collectionNotices.map(cn => {
                        let cooldownLabel = '-';
                        if (cn.cooldownUntil) {
                          const cd = new Date(cn.cooldownUntil);
                          const today = new Date('2026-03-03');
                          const diff = Math.ceil((cd - today) / 86400000);
                          if (diff > 0) {
                            cooldownLabel = '<span class="chip chip-yellow">อีก ' + diff + ' วัน</span>';
                          } else {
                            cooldownLabel = '<span class="chip chip-green">พร้อมส่ง</span>';
                          }
                        }
                        return `
                          <tr>
                            <td class="mono text-sm">${cn.id}</td>
                            <td class="font-600">${cn.tenantName}</td>
                            <td class="mono text-sm">${cn.invoiceId || '-'}</td>
                            <td class="mono font-600">${d.formatCurrency(cn.amount)}</td>
                            <td class="text-sm text-muted">${cn.sentDate}</td>
                            <td class="text-sm">${cn.channel}</td>
                            <td>${cooldownLabel}</td>
                            <td>${d.statusChip(cn.status)}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>`
            }
          `
        }
      </div>
    `;
  },

  init(activeTab) {
    const d = window.MockData;
    const self = window.Pages.billing;

    // ─── Tab Switching ───
    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    const tabMap = {
      'invoices':     'tab-invoices',
      'purchase-log': 'tab-purchase-log',
      'verification': 'tab-verification',
      'credit-lines': 'tab-credit-lines',
      'refunds':      'tab-refunds',
      'aging':        'tab-aging',
    };

    function activateTab(tabKey) {
      tabs.forEach(t => t.classList.remove('active'));
      Object.values(tabMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const targetTab = document.querySelector(`.tab-bar .tab-item[data-tab="${tabKey}"]`);
      if (targetTab) targetTab.classList.add('active');
      const targetEl = document.getElementById(tabMap[tabKey]);
      if (targetEl) targetEl.classList.remove('hidden');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });

    // Restore active tab if re-rendering
    if (activeTab && tabMap[activeTab]) {
      activateTab(activeTab);
    }

    // ─── Purchase Log Filters ───
    const plFilterPlatform = document.getElementById('pl-filter-platform');
    const plFilterType = document.getElementById('pl-filter-type');
    const plFilterStatus = document.getElementById('pl-filter-status');

    function applyPLFilters() {
      const platform = plFilterPlatform ? plFilterPlatform.value : '';
      const type = plFilterType ? plFilterType.value : '';
      const status = plFilterStatus ? plFilterStatus.value : '';
      const rows = document.querySelectorAll('#pl-table-body tr');
      rows.forEach(row => {
        const matchPlatform = !platform || row.dataset.platform === platform;
        const matchType = !type || row.dataset.type === type;
        const matchStatus = !status || row.dataset.status === status;
        row.style.display = (matchPlatform && matchType && matchStatus) ? '' : 'none';
      });
    }

    if (plFilterPlatform) plFilterPlatform.addEventListener('change', applyPLFilters);
    if (plFilterType) plFilterType.addEventListener('change', applyPLFilters);
    if (plFilterStatus) plFilterStatus.addEventListener('change', applyPLFilters);

    // ─── Purchase Log Export CSV ───
    const plExportCSV = document.getElementById('pl-export-csv');
    if (plExportCSV) {
      plExportCSV.addEventListener('click', () => {
        const headers = ['วันที่', 'Tenant', 'Sub-Platform', 'ประเภท', 'รายละเอียด', 'ช่องทาง', 'จำนวนเงิน', 'สถานะ', 'อ้างอิง'];
        const rows = [
          headers,
          ...d.purchaseLog
            .filter((p, i) => {
              const row = document.querySelectorAll('#pl-table-body tr')[i];
              return !row || row.style.display !== 'none';
            })
            .map(p => [
              p.date, `"${p.tenantName}"`, p.subPlatform, p.type,
              `"${p.description}"`, p.method, p.amount, p.status, p.ref
            ])
        ];
        const csv = rows.map(r => r.map(v => self._csvCell(v)).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purchase_log_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // ─── Purchase Log Export PDF (print-friendly) ───
    const plExportPDF = document.getElementById('pl-export-pdf');
    if (plExportPDF) {
      plExportPDF.addEventListener('click', () => {
        const printRows = d.purchaseLog.map(p =>
          `<tr>
            <td>${p.date}</td><td>${p.tenantName}</td><td>${p.subPlatform}</td>
            <td>${p.type}</td><td>${p.description}</td><td>${p.method}</td>
            <td>${p.amount.toLocaleString('th-TH', {minimumFractionDigits:2})} THB</td>
            <td>${p.status}</td><td>${p.ref}</td>
          </tr>`
        ).join('');
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
          <title>Purchase Log Report</title>
          <style>
            body{font-family:sans-serif;font-size:12px;padding:20px;}
            h2{margin-bottom:12px;}
            table{width:100%;border-collapse:collapse;}
            th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}
            th{background:#f5f5f5;font-weight:bold;}
          </style></head><body>
          <h2>Purchase Log — ${new Date().toLocaleDateString('th-TH')}</h2>
          <table><thead><tr>
            <th>วันที่</th><th>Tenant</th><th>Sub-Platform</th><th>ประเภท</th>
            <th>รายละเอียด</th><th>ช่องทาง</th><th>จำนวนเงิน</th><th>สถานะ</th><th>อ้างอิง</th>
          </tr></thead><tbody>${printRows}</tbody></table>
          <script>window.onload=function(){window.print();}<\/script>
          </body></html>`;
        const w = window.open('', '_blank');
        w.document.write(html);
        w.document.close();
      });
    }

    // ─── Payment Verification: Approve ───
    document.querySelectorAll('.verify-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const invId = btn.dataset.id;
        const inv = d.invoices.find(i => i.id === invId);
        if (inv) {
          inv.status = 'Paid';
          inv.paidDate = new Date().toISOString().slice(0, 10);
        }
        window.App.closeModal && window.App.closeModal();
        self._rerender('verification');
      });
    });

    // ─── Payment Verification: Reject ───
    document.querySelectorAll('.verify-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const invId = btn.dataset.id;
        showRejectModal(invId);
      });
    });

    function showRejectModal(invId) {
      const inv = d.invoices.find(i => i.id === invId);
      if (!inv) return;
      const html = `
        <div class="modal">
          <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
          <div class="modal-title mb-8">ปฏิเสธการชำระเงิน</div>
          <div class="text-sm text-muted mb-16">ใบแจ้งหนี้: <strong>${invId}</strong> — ${inv.tenantName}</div>
          <div class="form-group">
            <label class="form-label">เหตุผลในการปฏิเสธ <span style="color:var(--error)">*</span></label>
            <textarea id="reject-reason" class="form-input" rows="3" placeholder="ระบุเหตุผล..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
            <button class="btn btn-danger" id="reject-confirm-btn"><i class="fa-solid fa-xmark"></i> ยืนยันปฏิเสธ</button>
          </div>
        </div>
      `;
      window.App.showModal(html);

      document.getElementById('reject-confirm-btn').addEventListener('click', () => {
        const reason = document.getElementById('reject-reason').value.trim();
        if (!reason) { App.toast('กรุณาระบุเหตุผล', 'error'); return; }
        const invoice = d.invoices.find(i => i.id === invId);
        if (invoice) {
          invoice.status = 'Issued';
          invoice.rejectReason = reason;
        }
        window.App.closeModal();
        self._rerender('verification');
      });
    }

    // ─── Credit Line: Approve Request ───
    document.querySelectorAll('.cl-approve-req-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.dataset.id;
        showCLApproveModal(reqId);
      });
    });

    function showCLApproveModal(reqId) {
      const req = (d.creditLineRequests || []).find(r => r.id === reqId);
      if (!req) return;
      const html = `
        <div class="modal">
          <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
          <div class="modal-title mb-8">อนุมัติวงเงินเครดิต</div>
          <div class="text-sm text-muted mb-16">Tenant: <strong>${req.tenantName}</strong> (ขอ ${req.requestedLimit.toLocaleString('th-TH')} THB)</div>
          <div class="form-group">
            <label class="form-label">วงเงินที่อนุมัติ (THB)</label>
            <input type="number" id="cl-limit" class="form-input" value="${req.requestedLimit}" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">รอบบิล (วัน)</label>
            <select id="cl-cycle" class="form-input">
              <option value="30">30 วัน</option>
              <option value="60">60 วัน</option>
              <option value="90">90 วัน</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">เงื่อนไขการชำระ</label>
            <select id="cl-terms" class="form-input">
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Net 15">Net 15</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
            <button class="btn btn-success" id="cl-approve-confirm"><i class="fa-solid fa-check"></i> อนุมัติวงเงิน</button>
          </div>
        </div>
      `;
      window.App.showModal(html);

      document.getElementById('cl-approve-confirm').addEventListener('click', () => {
        const limit = parseFloat(document.getElementById('cl-limit').value);
        const cycle = parseInt(document.getElementById('cl-cycle').value);
        const terms = document.getElementById('cl-terms').value;
        if (!limit || limit <= 0) { App.toast('กรุณากรอกวงเงิน', 'error'); return; }

        const newCL = {
          id: 'CL-' + (Date.now()),
          tenantId: req.tenantId,
          tenantName: req.tenantName,
          creditLimit: limit,
          usedAmount: 0,
          availableCredit: limit,
          billingCycle: cycle,
          paymentTerms: terms,
          status: 'Active',
          approvedDate: new Date().toISOString().slice(0, 10),
          approvedBy: 'Finance Admin',
          lastInvoice: null,
        };
        d.creditLines = d.creditLines || [];
        d.creditLines.push(newCL);
        // Remove from requests
        d.creditLineRequests = (d.creditLineRequests || []).filter(r => r.id !== reqId);

        window.App.closeModal();
        self._rerender('credit-lines');
      });
    }

    // ─── Credit Line: Reject Request ───
    document.querySelectorAll('.cl-reject-req-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.dataset.id;
        const req = (d.creditLineRequests || []).find(r => r.id === reqId);
        if (!req) return;
        App.confirm(`ยืนยันการปฏิเสธคำขอวงเงินของ ${req.tenantName}?`, { title: 'ปฏิเสธคำขอวงเงิน', confirmText: 'ปฏิเสธ', cancelText: 'ยกเลิก', type: 'danger' }).then(ok => {
          if (!ok) return;
          d.creditLineRequests = (d.creditLineRequests || []).filter(r => r.id !== reqId);
          window.App.closeModal && window.App.closeModal();
          self._rerender('credit-lines');
        });
      });
    });

    // ─── Refund: Approve ───
    document.querySelectorAll('.refund-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const refId = btn.dataset.id;
        const ref = (d.refundRequests || []).find(r => r.id === refId);
        if (!ref) return;
        showRefundApproveModal(ref);
      });
    });

    function showRefundApproveModal(ref) {
      const needsSuperAdmin = !ref.superAdminApproved;
      const needsFinance = !ref.financeApproved;
      const html = `
        <div class="modal">
          <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
          <div class="modal-title mb-8">อนุมัติคำขอคืนเงิน</div>
          <div class="text-sm text-muted mb-4">Tenant: <strong>${ref.tenantName}</strong></div>
          <div class="text-sm text-muted mb-16">จำนวนเงิน: <strong>${d.formatCurrency(ref.amount)}</strong> | เหตุผล: ${ref.reason}</div>
          <div class="card p-16 mb-16">
            <div class="text-sm font-600 mb-10">สถานะ Dual Approval</div>
            <div class="flex gap-12">
              <div class="flex items-center gap-6">
                <span class="chip ${ref.superAdminApproved ? 'chip-green' : 'chip-gray'}">
                  <i class="fa-solid fa-shield-halved"></i> Super Admin ${ref.superAdminApproved ? '✓' : '✗'}
                </span>
              </div>
              <div class="flex items-center gap-6">
                <span class="chip ${ref.financeApproved ? 'chip-green' : 'chip-gray'}">
                  <i class="fa-solid fa-coins"></i> Finance ${ref.financeApproved ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">อนุมัติในฐานะ</label>
            <select id="refund-role" class="form-input">
              ${needsSuperAdmin ? '<option value="superAdmin">Super Admin</option>' : ''}
              ${needsFinance ? '<option value="finance">Finance</option>' : ''}
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
            <button class="btn btn-success" id="refund-confirm-btn"><i class="fa-solid fa-check"></i> อนุมัติ</button>
          </div>
        </div>
      `;
      window.App.showModal(html);

      document.getElementById('refund-confirm-btn').addEventListener('click', () => {
        const role = document.getElementById('refund-role').value;
        const refund = (d.refundRequests || []).find(r => r.id === ref.id);
        if (refund) {
          if (role === 'superAdmin') refund.superAdminApproved = true;
          if (role === 'finance') refund.financeApproved = true;
          if (refund.superAdminApproved && refund.financeApproved) {
            refund.status = 'Approved';
          }
        }
        window.App.closeModal();
        self._rerender('refunds');
      });
    }

    // ─── Aging: Send Collection Notice ───
    document.querySelectorAll('.send-notice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tenantId = btn.dataset.id;
        const row = (d.agingReport || []).find(r => r.tenantId === tenantId);
        if (!row) return;

        const html = `
          <div class="modal">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title mb-8">ส่งใบทวงหนี้</div>
            <div class="text-sm text-muted mb-16">
              Tenant: <strong>${row.tenantName}</strong><br>
              ยอดค้างชำระ: <strong class="text-error">${d.formatCurrency(row.totalOverdue)}</strong> (ค้างมา ${row.daysOverdue} วัน)
            </div>
            <div class="card p-16 mb-16">
              <div class="text-sm text-muted">หลังส่งใบทวงหนี้จะมี Cooldown 7 วัน ก่อนส่งได้อีกครั้ง</div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="notice-confirm-btn"><i class="fa-solid fa-envelope"></i> ยืนยันส่งใบทวงหนี้</button>
            </div>
          </div>
        `;
        window.App.showModal(html);

        document.getElementById('notice-confirm-btn').addEventListener('click', () => {
          const today = new Date('2026-03-03');
          const cooldownDate = new Date(today);
          cooldownDate.setDate(cooldownDate.getDate() + 7);
          const cooldownStr = cooldownDate.toISOString().slice(0, 10);

          // Update or add collectionNotice
          d.collectionNotices = d.collectionNotices || [];
          const existing = d.collectionNotices.find(n => n.tenantId === tenantId);
          if (existing) {
            existing.sentDate = today.toISOString().slice(0, 10);
            existing.cooldownUntil = cooldownStr;
            existing.status = 'Sent';
          } else {
            d.collectionNotices.push({
              id: 'CN-' + Date.now(),
              tenantId,
              tenantName: row.tenantName,
              sentDate: today.toISOString().slice(0, 10),
              channel: 'Email + Telegram',
              cooldownUntil: cooldownStr,
              status: 'Sent',
            });
          }

          // Update aging report lastNotice
          row.lastNotice = today.toISOString().slice(0, 10);

          window.App.closeModal();
          self._rerender('aging');
        });
      });
    });
  }
};
