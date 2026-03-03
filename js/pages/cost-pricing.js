/* ================================================================
   Page Module — Cost & Pricing
   ================================================================ */

window.Pages = window.Pages || {};
window.Pages.costPricing = {

  // ─── Helper: re-render page ───
  _rerender() {
    const ct = document.getElementById('content');
    ct.innerHTML = window.Pages.costPricing.render();
    window.Pages.costPricing.init();
  },

  // ─── Helper: format cost with precision ───
  _fmtCost(n) {
    if (n == null) return '-';
    return n.toFixed(4) + ' THB';
  },

  // ─── Helper: billing type chip ───
  _billingChip(type) {
    const map = {
      'Per Minute': 'chip-blue',
      'Per Request': 'chip-orange',
      'Per Token': 'chip-purple',
    };
    return `<span class="chip ${map[type] || 'chip-gray'}">${type}</span>`;
  },

  // ─── Helper: snapshot type chip ───
  _snapTypeChip(type) {
    return type === 'Default'
      ? '<span class="chip chip-blue">Default</span>'
      : '<span class="chip chip-orange">Custom</span>';
  },

  render() {
    const d = window.MockData;
    const costConfig = d.costConfig;
    const mc = d.marginConfig;
    const snapshots = d.snapshots;
    const priceLocks = d.priceLocks;
    const ccr = d.costChangeRequests;
    const mcr = d.marginChangeRequests;
    const self = window.Pages.costPricing;

    // Stats
    const totalServices = costConfig.length;
    const activeServices = costConfig.filter(c => c.status === 'Active').length;
    const pendingCCR = ccr.filter(r => r.status === 'Pending').length;
    const pendingMCR = mcr.filter(r => r.status === 'Pending').length;
    const totalPendingRequests = pendingCCR + pendingMCR;
    const activeSnapshots = snapshots.filter(s => s.isActive).length;
    const activeLocks = priceLocks.filter(pl => pl.status === 'Active').length;

    return `
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="heading">COST & PRICING</h1>
        <div class="page-header-actions">
          <button class="btn btn-outline" id="btn-export-pricing"><i class="fa-solid fa-file-export"></i> ส่งออกข้อมูล</button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid-4 mb-20">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Service Codes</span>
            <div class="stat-icon blue"><i class="fa-solid fa-cubes"></i></div>
          </div>
          <div class="stat-value mono">${totalServices}</div>
          <div class="stat-change up"><i class="fa-solid fa-circle-check"></i> ${activeServices} Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Global Margin</span>
            <div class="stat-icon green"><i class="fa-solid fa-percent"></i></div>
          </div>
          <div class="stat-value mono">${mc.global}%</div>
          <div class="stat-change up">อัตรากำไรมาตรฐาน</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">คำขอรอดำเนินการ</span>
            <div class="stat-icon yellow"><i class="fa-solid fa-clock-rotate-left"></i></div>
          </div>
          <div class="stat-value mono">${totalPendingRequests}</div>
          <div class="stat-change ${totalPendingRequests > 0 ? 'down' : 'up'}">${pendingCCR} Cost / ${pendingMCR} Margin</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Snapshots & Price Locks</span>
            <div class="stat-icon purple"><i class="fa-solid fa-camera"></i></div>
          </div>
          <div class="stat-value mono">${activeSnapshots}</div>
          <div class="stat-change up"><i class="fa-solid fa-lock"></i> ${activeLocks} Price Lock</div>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar mb-20" id="cp-tabs">
        <div class="tab-item active" data-tab="cost-config"><i class="fa-solid fa-coins"></i> Cost Configuration</div>
        <div class="tab-item" data-tab="margin-config"><i class="fa-solid fa-percent"></i> Margin Configuration</div>
        <div class="tab-item" data-tab="snapshots"><i class="fa-solid fa-camera"></i> Pricing Snapshots</div>
        <div class="tab-item" data-tab="change-requests"><i class="fa-solid fa-code-pull-request"></i> Change Requests ${totalPendingRequests > 0 ? `<span class="chip chip-yellow" style="font-size:10px;padding:1px 6px;margin-left:6px;">${totalPendingRequests}</span>` : ''}</div>
      </div>

      <!-- ===================== TAB 1: Cost Configuration ===================== -->
      <div id="tab-cost-config" class="cp-tab-content">
        <div class="flex justify-between items-center mb-16">
          <div class="section-title">ตารางต้นทุนบริการ (Cost per Unit)</div>
          <button class="btn btn-primary btn-sm" id="btn-add-cost"><i class="fa-solid fa-plus"></i> เพิ่ม Service Code</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Service Code</th>
                <th>ชื่อบริการ</th>
                <th>Billing Type</th>
                <th>Cost / Unit</th>
                <th>สกุลเงิน</th>
                <th>วันที่มีผล</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${costConfig.map((c, idx) => `
                <tr>
                  <td class="mono text-primary font-600">${c.serviceCode}</td>
                  <td class="font-600">${c.name}</td>
                  <td>${self._billingChip(c.billingType)}</td>
                  <td class="mono font-600">${self._fmtCost(c.costPerUnit)}</td>
                  <td class="mono text-sm">${c.currency}</td>
                  <td class="text-sm text-muted">${c.effectiveDate}</td>
                  <td>${d.statusChip(c.status)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline cost-edit-btn" data-idx="${idx}"><i class="fa-solid fa-pen"></i> แก้ไข</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===================== TAB 2: Margin Configuration ===================== -->
      <div id="tab-margin-config" class="cp-tab-content hidden">

        <!-- Global Margin -->
        <div class="card-accent p-20 mb-20">
          <div class="flex justify-between items-center mb-12">
            <div>
              <div class="section-title mb-4">Global Margin</div>
              <div class="text-sm text-muted">อัตรากำไรมาตรฐานที่ใช้กับทุกบริการ (ถ้าไม่มี Override)</div>
            </div>
            <button class="btn btn-outline btn-sm" id="btn-edit-global-margin"><i class="fa-solid fa-pen"></i> แก้ไข</button>
          </div>
          <div class="flex items-center gap-16">
            <div class="mono font-700" style="font-size:48px;color:var(--primary);">${mc.global}%</div>
            <div class="flex-col gap-4">
              <div class="text-sm text-muted">ตัวอย่าง: ต้นทุน 1.00 THB</div>
              <div class="text-sm">ราคาขาย = <span class="mono font-600 text-success">${(1 / (1 - mc.global / 100)).toFixed(2)} THB</span></div>
            </div>
          </div>
        </div>

        <!-- Provider Margins -->
        <div class="section-title mb-12">Provider Margins</div>
        <div class="table-wrap mb-20">
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Margin %</th>
                <th>ส่วนต่างจาก Global</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${mc.providers.map((p, idx) => `
                <tr>
                  <td class="font-600">${p.name}</td>
                  <td class="mono font-600">${p.margin}%</td>
                  <td>
                    ${p.margin > mc.global
                      ? `<span class="text-success">+${p.margin - mc.global}%</span>`
                      : p.margin < mc.global
                        ? `<span class="text-error">${p.margin - mc.global}%</span>`
                        : '<span class="text-muted">เท่ากับ Global</span>'}
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline provider-margin-edit-btn" data-idx="${idx}"><i class="fa-solid fa-pen"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Service Code Margins -->
        <div class="flex justify-between items-center mb-12">
          <div class="section-title">Service Code Margins (Override)</div>
          <button class="btn btn-outline btn-sm" id="btn-add-service-margin"><i class="fa-solid fa-plus"></i> เพิ่ม Override</button>
        </div>
        <div class="table-wrap mb-20">
          <table>
            <thead>
              <tr>
                <th>Service Code</th>
                <th>Margin %</th>
                <th>ส่วนต่างจาก Global</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${mc.serviceCodes.map((sc, idx) => `
                <tr>
                  <td class="mono text-primary font-600">${sc.code}</td>
                  <td class="mono font-600">${sc.margin}%</td>
                  <td>
                    ${sc.margin > mc.global
                      ? `<span class="text-success">+${sc.margin - mc.global}%</span>`
                      : sc.margin < mc.global
                        ? `<span class="text-error">${sc.margin - mc.global}%</span>`
                        : '<span class="text-muted">เท่ากับ Global</span>'}
                  </td>
                  <td>
                    <div class="flex gap-6">
                      <button class="btn btn-sm btn-outline sc-margin-edit-btn" data-idx="${idx}"><i class="fa-solid fa-pen"></i></button>
                      <button class="btn btn-sm btn-danger sc-margin-delete-btn" data-idx="${idx}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pricing Calculator -->
        <div class="divider mb-20"></div>
        <div class="section-title mb-12"><i class="fa-solid fa-calculator"></i> เครื่องคำนวณราคา (Bidirectional Calculator)</div>
        <div class="banner-info mb-16">
          <div class="banner-icon"><i class="fa-solid fa-circle-info"></i></div>
          <div class="text-sm">สูตร: <span class="mono font-600">Sell Price = Cost / (1 - Margin% / 100)</span> — เปลี่ยนค่าใดก็ได้ ระบบจะคำนวณค่าที่เหลือให้อัตโนมัติ</div>
        </div>
        <div class="card p-20">
          <div class="grid-3 gap-20">
            <div class="form-group">
              <label class="form-label">Cost (ต้นทุน THB)</label>
              <input type="number" id="calc-cost" class="form-input" value="1.00" step="0.0001" min="0">
            </div>
            <div class="form-group">
              <label class="form-label">Margin %</label>
              <input type="number" id="calc-margin" class="form-input" value="${mc.global}" step="0.1" min="0" max="99.99">
            </div>
            <div class="form-group">
              <label class="form-label">Sell Price (ราคาขาย THB)</label>
              <input type="number" id="calc-sell" class="form-input" value="${(1 / (1 - mc.global / 100)).toFixed(4)}" step="0.0001" min="0">
            </div>
          </div>
          <div class="flex items-center gap-16 mt-16">
            <div class="card p-16 flex-1" style="text-align:center;">
              <div class="text-sm text-muted mb-4">กำไรต่อหน่วย</div>
              <div class="mono font-700 text-success" id="calc-profit" style="font-size:20px;">
                ${((1 / (1 - mc.global / 100)) - 1).toFixed(4)} THB
              </div>
            </div>
            <div class="card p-16 flex-1" style="text-align:center;">
              <div class="text-sm text-muted mb-4">Markup %</div>
              <div class="mono font-700 text-primary" id="calc-markup" style="font-size:20px;">
                ${(((1 / (1 - mc.global / 100)) - 1) / 1 * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== TAB 3: Pricing Snapshots ===================== -->
      <div id="tab-snapshots" class="cp-tab-content hidden">
        <div class="flex justify-between items-center mb-16">
          <div class="section-title">Pricing Snapshots</div>
          <button class="btn btn-primary btn-sm" id="btn-create-snapshot"><i class="fa-solid fa-plus"></i> สร้าง Snapshot ใหม่</button>
        </div>

        <div class="grid-3 gap-16 mb-24">
          ${snapshots.map(snap => {
            const isDefault = snap.type === 'Default';
            const tenant = snap.tenantId ? d.tenants.find(t => t.id === snap.tenantId) : null;
            return `
              <div class="${isDefault ? 'card-accent' : 'card'} p-20">
                <div class="flex justify-between items-center mb-12">
                  ${self._snapTypeChip(snap.type)}
                  ${snap.isActive ? '<span class="chip chip-green">Active</span>' : '<span class="chip chip-gray">Inactive</span>'}
                </div>
                <div class="font-700 mb-8" style="font-size:16px;">${snap.name}</div>
                <div class="flex-col gap-6 mb-12">
                  <div class="flex justify-between">
                    <span class="text-sm text-muted">ID</span>
                    <span class="text-sm mono">${snap.id}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted">สร้างเมื่อ</span>
                    <span class="text-sm mono">${snap.createdDate}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted">Global Margin</span>
                    <span class="text-sm mono font-600">${snap.data.globalMargin}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted">ลูกค้าที่ผูก</span>
                    <span class="text-sm mono font-600">${snap.assignedCustomers} ราย</span>
                  </div>
                  ${tenant ? `
                    <div class="flex justify-between">
                      <span class="text-sm text-muted">Tenant</span>
                      <span class="text-sm font-600">${tenant.name}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Price Locks -->
        <div class="divider mb-20"></div>
        <div class="section-title mb-12"><i class="fa-solid fa-lock"></i> Price Locks</div>
        ${priceLocks.length === 0
          ? '<div class="text-sm text-muted mb-16">ไม่มี Price Lock ที่กำลังใช้งาน</div>'
          : `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tenant</th>
                    <th>Snapshot</th>
                    <th>เริ่มต้น</th>
                    <th>สิ้นสุด</th>
                    <th>เหลืออีก (วัน)</th>
                    <th>สถานะ</th>
                    <th>แจ้งเตือน 30 วัน</th>
                  </tr>
                </thead>
                <tbody>
                  ${priceLocks.map(pl => `
                    <tr>
                      <td class="mono text-sm">${pl.id}</td>
                      <td class="font-600">${pl.tenantName}</td>
                      <td class="mono text-sm">${pl.snapshotId}</td>
                      <td class="text-sm mono">${pl.startDate}</td>
                      <td class="text-sm mono">${pl.endDate}</td>
                      <td>
                        <span class="mono font-700 ${pl.daysRemaining <= 30 ? 'text-warning' : 'text-success'}">${pl.daysRemaining}</span>
                        ${pl.daysRemaining <= 30 ? '<span class="chip chip-yellow" style="font-size:10px;padding:1px 4px;margin-left:4px;">ใกล้หมดอายุ</span>' : ''}
                      </td>
                      <td>${d.statusChip(pl.status)}</td>
                      <td>${pl.notified30d ? '<span class="chip chip-green">แจ้งแล้ว</span>' : '<span class="chip chip-gray">ยังไม่แจ้ง</span>'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `
        }
      </div>

      <!-- ===================== TAB 4: Change Requests ===================== -->
      <div id="tab-change-requests" class="cp-tab-content hidden">

        <!-- Cost Change Requests -->
        <div class="section-title mb-12"><i class="fa-solid fa-coins"></i> Cost Change Requests</div>
        ${ccr.length === 0
          ? '<div class="text-sm text-muted mb-20">ไม่มีคำขอเปลี่ยนแปลงต้นทุน</div>'
          : `
            <div class="table-wrap mb-24">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Service Code</th>
                    <th>ชื่อบริการ</th>
                    <th>ต้นทุนปัจจุบัน</th>
                    <th>ต้นทุนใหม่</th>
                    <th>เหตุผล</th>
                    <th>วันที่มีผล</th>
                    <th>สถานะ</th>
                    <th>ร้องขอโดย</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  ${ccr.map(r => {
                    const diff = r.newCost - r.currentCost;
                    const diffPct = ((diff / r.currentCost) * 100).toFixed(1);
                    return `
                      <tr>
                        <td class="mono text-sm">${r.id}</td>
                        <td class="mono text-primary font-600">${r.serviceCode}</td>
                        <td class="font-600">${r.serviceName}</td>
                        <td class="mono">${self._fmtCost(r.currentCost)}</td>
                        <td class="mono font-600 ${diff < 0 ? 'text-success' : 'text-error'}">${self._fmtCost(r.newCost)}
                          <span class="text-xs ${diff < 0 ? 'text-success' : 'text-error'}">(${diff < 0 ? '' : '+'}${diffPct}%)</span>
                        </td>
                        <td class="text-sm">${r.reason}</td>
                        <td class="text-sm mono">${r.effectiveDate}</td>
                        <td>${d.statusChip(r.status)}</td>
                        <td class="text-sm">${r.requestedBy}</td>
                        <td>
                          ${r.status === 'Pending' ? `
                            <div class="flex gap-6">
                              <button class="btn btn-sm btn-success ccr-approve-btn" data-id="${r.id}"><i class="fa-solid fa-check"></i></button>
                              <button class="btn btn-sm btn-danger ccr-reject-btn" data-id="${r.id}"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                          ` : `
                            <span class="text-sm text-muted">${r.approvedBy || '-'}</span>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `
        }

        <!-- Margin Change Requests -->
        <div class="divider mb-20"></div>
        <div class="section-title mb-12"><i class="fa-solid fa-percent"></i> Margin Change Requests</div>
        ${mcr.length === 0
          ? '<div class="text-sm text-muted mb-20">ไม่มีคำขอเปลี่ยนแปลง Margin</div>'
          : `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ระดับ</th>
                    <th>เป้าหมาย</th>
                    <th>Margin ปัจจุบัน</th>
                    <th>Margin ใหม่</th>
                    <th>เหตุผล</th>
                    <th>สถานะ</th>
                    <th>ร้องขอโดย</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  ${mcr.map(r => {
                    const diff = r.newMargin - r.currentMargin;
                    return `
                      <tr>
                        <td class="mono text-sm">${r.id}</td>
                        <td><span class="chip chip-blue">${r.level}</span></td>
                        <td class="mono text-primary font-600">${r.target}</td>
                        <td class="mono">${r.currentMargin}%</td>
                        <td class="mono font-600 ${diff > 0 ? 'text-success' : 'text-error'}">${r.newMargin}%
                          <span class="text-xs ${diff > 0 ? 'text-success' : 'text-error'}">(${diff > 0 ? '+' : ''}${diff}%)</span>
                        </td>
                        <td class="text-sm">${r.reason}</td>
                        <td>${d.statusChip(r.status)}</td>
                        <td class="text-sm">${r.requestedBy}</td>
                        <td>
                          ${r.status === 'Pending' ? `
                            <div class="flex gap-6">
                              <button class="btn btn-sm btn-success mcr-approve-btn" data-id="${r.id}"><i class="fa-solid fa-check"></i></button>
                              <button class="btn btn-sm btn-danger mcr-reject-btn" data-id="${r.id}"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                          ` : `
                            <span class="text-sm text-muted">${r.approvedBy || '-'}</span>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `
        }
      </div>

    `;
  },

  init() {
    const d = window.MockData;
    const self = window.Pages.costPricing;

    // ─── Tab Switching ───
    const tabs = document.querySelectorAll('#cp-tabs .tab-item');
    const tabMap = {
      'cost-config': 'tab-cost-config',
      'margin-config': 'tab-margin-config',
      'snapshots': 'tab-snapshots',
      'change-requests': 'tab-change-requests',
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        Object.values(tabMap).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('hidden');
        });

        const targetId = tabMap[tab.dataset.tab];
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
      });
    });

    // ═══════════════════════════════════════════════
    // TAB 1: Cost Configuration
    // ═══════════════════════════════════════════════

    // ─── Add Cost Modal ───
    const btnAddCost = document.getElementById('btn-add-cost');
    if (btnAddCost) {
      btnAddCost.addEventListener('click', () => {
        window.App.showModal(`
          <div class="modal modal-wide">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">เพิ่ม Service Code ใหม่</div>
            <div class="modal-subtitle">กำหนดต้นทุนบริการใหม่เข้าระบบ</div>
            <div class="flex-col gap-16">
              <div class="grid-2 gap-16">
                <div class="form-group">
                  <label class="form-label">Service Code</label>
                  <input type="text" class="form-input" id="add-cost-code" placeholder="เช่น avatar-stt">
                </div>
                <div class="form-group">
                  <label class="form-label">ชื่อบริการ</label>
                  <input type="text" class="form-input" id="add-cost-name" placeholder="เช่น Speech-to-Text">
                </div>
              </div>
              <div class="grid-3 gap-16">
                <div class="form-group">
                  <label class="form-label">Billing Type</label>
                  <select class="form-input" id="add-cost-billing">
                    <option value="Per Minute">Per Minute</option>
                    <option value="Per Request">Per Request</option>
                    <option value="Per Token">Per Token</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Cost per Unit (THB)</label>
                  <input type="number" class="form-input" id="add-cost-unit" step="0.0001" min="0" placeholder="0.0000">
                </div>
                <div class="form-group">
                  <label class="form-label">วันที่มีผล</label>
                  <input type="date" class="form-input" id="add-cost-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-add-cost"><i class="fa-solid fa-plus"></i> เพิ่ม Service Code</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-add-cost');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const code = document.getElementById('add-cost-code').value.trim();
            const name = document.getElementById('add-cost-name').value.trim();
            const billing = document.getElementById('add-cost-billing').value;
            const costVal = parseFloat(document.getElementById('add-cost-unit').value);
            const dateVal = document.getElementById('add-cost-date').value;

            if (!code || !name || isNaN(costVal) || !dateVal) {
              App.toast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
              return;
            }
            if (d.costConfig.find(c => c.serviceCode === code)) {
              App.toast('Service Code นี้มีอยู่ในระบบแล้ว', 'error');
              return;
            }

            d.costConfig.push({
              serviceCode: code,
              name: name,
              billingType: billing,
              costPerUnit: costVal,
              currency: 'THB',
              effectiveDate: dateVal,
              status: 'Active',
            });

            window.App.closeModal();
            self._rerender();
          });
        }, 50);
      });
    }

    // ─── Edit Cost Modal ───
    document.querySelectorAll('.cost-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const c = d.costConfig[idx];
        if (!c) return;

        window.App.showModal(`
          <div class="modal modal-wide">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">แก้ไขต้นทุนบริการ</div>
            <div class="modal-subtitle"><span class="mono">${c.serviceCode}</span> — ${c.name}</div>
            <div class="flex-col gap-16">
              <div class="grid-2 gap-16">
                <div class="form-group">
                  <label class="form-label">ชื่อบริการ</label>
                  <input type="text" class="form-input" id="edit-cost-name" value="${c.name}">
                </div>
                <div class="form-group">
                  <label class="form-label">Billing Type</label>
                  <select class="form-input" id="edit-cost-billing">
                    <option value="Per Minute" ${c.billingType === 'Per Minute' ? 'selected' : ''}>Per Minute</option>
                    <option value="Per Request" ${c.billingType === 'Per Request' ? 'selected' : ''}>Per Request</option>
                    <option value="Per Token" ${c.billingType === 'Per Token' ? 'selected' : ''}>Per Token</option>
                  </select>
                </div>
              </div>
              <div class="grid-3 gap-16">
                <div class="form-group">
                  <label class="form-label">Cost per Unit (THB)</label>
                  <input type="number" class="form-input" id="edit-cost-unit" step="0.0001" min="0" value="${c.costPerUnit}">
                </div>
                <div class="form-group">
                  <label class="form-label">วันที่มีผล</label>
                  <input type="date" class="form-input" id="edit-cost-date" value="${c.effectiveDate}">
                </div>
                <div class="form-group">
                  <label class="form-label">สถานะ</label>
                  <select class="form-input" id="edit-cost-status">
                    <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Inactive" ${c.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-edit-cost"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-edit-cost');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const name = document.getElementById('edit-cost-name').value.trim();
            const billing = document.getElementById('edit-cost-billing').value;
            const costVal = parseFloat(document.getElementById('edit-cost-unit').value);
            const dateVal = document.getElementById('edit-cost-date').value;
            const statusVal = document.getElementById('edit-cost-status').value;

            if (!name || isNaN(costVal) || !dateVal) {
              App.toast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
              return;
            }

            c.name = name;
            c.billingType = billing;
            c.costPerUnit = costVal;
            c.effectiveDate = dateVal;
            c.status = statusVal;

            window.App.closeModal();
            self._rerender();
          });
        }, 50);
      });
    });

    // ═══════════════════════════════════════════════
    // TAB 2: Margin Configuration
    // ═══════════════════════════════════════════════

    // ─── Edit Global Margin ───
    const btnEditGlobal = document.getElementById('btn-edit-global-margin');
    if (btnEditGlobal) {
      btnEditGlobal.addEventListener('click', () => {
        window.App.showModal(`
          <div class="modal">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">แก้ไข Global Margin</div>
            <div class="modal-subtitle">อัตรากำไรมาตรฐานที่ใช้กับทุกบริการ</div>
            <div class="flex-col gap-16">
              <div class="form-group">
                <label class="form-label">Global Margin (%)</label>
                <input type="number" class="form-input" id="edit-global-margin" value="${d.marginConfig.global}" step="0.1" min="0" max="99.99">
              </div>
              <div class="alert-warning p-12">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span class="text-sm"> การเปลี่ยนแปลง Global Margin จะมีผลกับราคาขายทุกบริการที่ไม่มี Override</span>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-global-margin"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-global-margin');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const val = parseFloat(document.getElementById('edit-global-margin').value);
            if (isNaN(val) || val < 0 || val >= 100) {
              App.toast('กรุณากรอก Margin ที่ถูกต้อง (0-99.99%)', 'error');
              return;
            }
            d.marginConfig.global = val;
            window.App.closeModal();
            self._rerender();
            // Switch to margin tab after rerender
            setTimeout(() => {
              const marginTab = document.querySelector('#cp-tabs .tab-item[data-tab="margin-config"]');
              if (marginTab) marginTab.click();
            }, 50);
          });
        }, 50);
      });
    }

    // ─── Edit Provider Margin ───
    document.querySelectorAll('.provider-margin-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const p = d.marginConfig.providers[idx];
        if (!p) return;

        window.App.showModal(`
          <div class="modal">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">แก้ไข Provider Margin</div>
            <div class="modal-subtitle">Provider: <span class="font-600">${p.name}</span></div>
            <div class="flex-col gap-16">
              <div class="form-group">
                <label class="form-label">Margin (%)</label>
                <input type="number" class="form-input" id="edit-provider-margin" value="${p.margin}" step="0.1" min="0" max="99.99">
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-provider-margin"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-provider-margin');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const val = parseFloat(document.getElementById('edit-provider-margin').value);
            if (isNaN(val) || val < 0 || val >= 100) {
              App.toast('กรุณากรอก Margin ที่ถูกต้อง (0-99.99%)', 'error');
              return;
            }
            p.margin = val;
            window.App.closeModal();
            self._rerender();
            setTimeout(() => {
              const marginTab = document.querySelector('#cp-tabs .tab-item[data-tab="margin-config"]');
              if (marginTab) marginTab.click();
            }, 50);
          });
        }, 50);
      });
    });

    // ─── Edit Service Code Margin ───
    document.querySelectorAll('.sc-margin-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const sc = d.marginConfig.serviceCodes[idx];
        if (!sc) return;

        window.App.showModal(`
          <div class="modal">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">แก้ไข Service Code Margin</div>
            <div class="modal-subtitle">Service Code: <span class="mono font-600">${sc.code}</span></div>
            <div class="flex-col gap-16">
              <div class="form-group">
                <label class="form-label">Margin (%)</label>
                <input type="number" class="form-input" id="edit-sc-margin" value="${sc.margin}" step="0.1" min="0" max="99.99">
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-sc-margin"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-sc-margin');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const val = parseFloat(document.getElementById('edit-sc-margin').value);
            if (isNaN(val) || val < 0 || val >= 100) {
              App.toast('กรุณากรอก Margin ที่ถูกต้อง (0-99.99%)', 'error');
              return;
            }
            sc.margin = val;
            window.App.closeModal();
            self._rerender();
            setTimeout(() => {
              const marginTab = document.querySelector('#cp-tabs .tab-item[data-tab="margin-config"]');
              if (marginTab) marginTab.click();
            }, 50);
          });
        }, 50);
      });
    });

    // ─── Delete Service Code Margin ───
    document.querySelectorAll('.sc-margin-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const sc = d.marginConfig.serviceCodes[idx];
        if (!sc) return;
        App.confirm(`ยืนยันลบ Margin Override สำหรับ "${sc.code}"?\nจะใช้ Global Margin แทน`, { title: 'ยืนยันการลบ', confirmText: 'ลบ', cancelText: 'ยกเลิก', type: 'danger' }).then(ok => {
          if (!ok) return;

          d.marginConfig.serviceCodes.splice(idx, 1);
          self._rerender();
          setTimeout(() => {
            const marginTab = document.querySelector('#cp-tabs .tab-item[data-tab="margin-config"]');
            if (marginTab) marginTab.click();
          }, 50);
        });
      });
    });

    // ─── Add Service Code Margin Override ───
    const btnAddServiceMargin = document.getElementById('btn-add-service-margin');
    if (btnAddServiceMargin) {
      btnAddServiceMargin.addEventListener('click', () => {
        const existingCodes = d.marginConfig.serviceCodes.map(sc => sc.code);
        const availableCodes = d.costConfig.filter(c => !existingCodes.includes(c.serviceCode));

        window.App.showModal(`
          <div class="modal">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">เพิ่ม Margin Override</div>
            <div class="modal-subtitle">กำหนด Margin เฉพาะสำหรับ Service Code</div>
            <div class="flex-col gap-16">
              <div class="form-group">
                <label class="form-label">Service Code</label>
                <select class="form-input" id="add-sc-margin-code">
                  <option value="">-- เลือก Service Code --</option>
                  ${availableCodes.map(c => `<option value="${c.serviceCode}">${c.serviceCode} — ${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Margin (%)</label>
                <input type="number" class="form-input" id="add-sc-margin-val" value="${d.marginConfig.global}" step="0.1" min="0" max="99.99">
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-add-sc-margin"><i class="fa-solid fa-plus"></i> เพิ่ม Override</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-add-sc-margin');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const code = document.getElementById('add-sc-margin-code').value;
            const val = parseFloat(document.getElementById('add-sc-margin-val').value);
            if (!code || isNaN(val) || val < 0 || val >= 100) {
              App.toast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
              return;
            }
            d.marginConfig.serviceCodes.push({ code: code, margin: val });
            window.App.closeModal();
            self._rerender();
            setTimeout(() => {
              const marginTab = document.querySelector('#cp-tabs .tab-item[data-tab="margin-config"]');
              if (marginTab) marginTab.click();
            }, 50);
          });
        }, 50);
      });
    }

    // ─── Bidirectional Calculator ───
    const calcCost = document.getElementById('calc-cost');
    const calcMargin = document.getElementById('calc-margin');
    const calcSell = document.getElementById('calc-sell');
    const calcProfit = document.getElementById('calc-profit');
    const calcMarkup = document.getElementById('calc-markup');

    function updateCalcDisplay(cost, margin, sell) {
      const profit = sell - cost;
      const markup = cost > 0 ? ((sell - cost) / cost * 100) : 0;
      if (calcProfit) calcProfit.textContent = profit.toFixed(4) + ' THB';
      if (calcMarkup) calcMarkup.textContent = markup.toFixed(2) + '%';
    }

    if (calcCost && calcMargin && calcSell) {
      // When Cost changes -> recalculate Sell Price
      calcCost.addEventListener('input', () => {
        const cost = parseFloat(calcCost.value) || 0;
        const margin = parseFloat(calcMargin.value) || 0;
        if (margin >= 100) return;
        const sell = cost / (1 - margin / 100);
        calcSell.value = sell.toFixed(4);
        updateCalcDisplay(cost, margin, sell);
      });

      // When Margin changes -> recalculate Sell Price
      calcMargin.addEventListener('input', () => {
        const cost = parseFloat(calcCost.value) || 0;
        const margin = parseFloat(calcMargin.value) || 0;
        if (margin >= 100) return;
        const sell = cost / (1 - margin / 100);
        calcSell.value = sell.toFixed(4);
        updateCalcDisplay(cost, margin, sell);
      });

      // When Sell Price changes -> recalculate Margin
      calcSell.addEventListener('input', () => {
        const cost = parseFloat(calcCost.value) || 0;
        const sell = parseFloat(calcSell.value) || 0;
        if (sell <= 0) return;
        const margin = (1 - cost / sell) * 100;
        calcMargin.value = margin.toFixed(2);
        updateCalcDisplay(cost, margin, sell);
      });
    }

    // ═══════════════════════════════════════════════
    // TAB 3: Pricing Snapshots
    // ═══════════════════════════════════════════════

    // ─── Create Snapshot ───
    const btnCreateSnapshot = document.getElementById('btn-create-snapshot');
    if (btnCreateSnapshot) {
      btnCreateSnapshot.addEventListener('click', () => {
        window.App.showModal(`
          <div class="modal modal-wide">
            <button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title heading">สร้าง Pricing Snapshot ใหม่</div>
            <div class="modal-subtitle">บันทึกสำเนาราคาปัจจุบันเพื่อกำหนดให้ลูกค้าเฉพาะกลุ่ม</div>
            <div class="flex-col gap-16">
              <div class="form-group">
                <label class="form-label">ชื่อ Snapshot</label>
                <input type="text" class="form-input" id="snap-name" placeholder="เช่น Enterprise Q2 2026">
              </div>
              <div class="grid-2 gap-16">
                <div class="form-group">
                  <label class="form-label">ประเภท</label>
                  <select class="form-input" id="snap-type">
                    <option value="Custom">Custom</option>
                    <option value="Default">Default</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Global Margin (%)</label>
                  <input type="number" class="form-input" id="snap-margin" value="${d.marginConfig.global}" step="0.1" min="0" max="99.99">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">ผูกกับ Tenant (ถ้ามี)</label>
                <select class="form-input" id="snap-tenant">
                  <option value="">-- ไม่ระบุ (ใช้ทั่วไป) --</option>
                  ${d.tenants.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
              <button class="btn btn-primary" id="modal-submit-snapshot"><i class="fa-solid fa-camera"></i> สร้าง Snapshot</button>
            </div>
          </div>
        `);

        setTimeout(() => {
          const submitBtn = document.getElementById('modal-submit-snapshot');
          if (!submitBtn) return;
          submitBtn.addEventListener('click', () => {
            const name = document.getElementById('snap-name').value.trim();
            const type = document.getElementById('snap-type').value;
            const margin = parseFloat(document.getElementById('snap-margin').value);
            const tenantId = document.getElementById('snap-tenant').value || null;

            if (!name || isNaN(margin)) {
              App.toast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
              return;
            }

            const newId = 'SNAP-' + String(d.snapshots.length + 1).padStart(3, '0');
            const today = new Date().toISOString().split('T')[0];

            d.snapshots.push({
              id: newId,
              name: name,
              type: type,
              createdDate: today,
              assignedCustomers: tenantId ? 1 : 0,
              isActive: true,
              tenantId: tenantId,
              data: { globalMargin: margin },
            });

            window.App.closeModal();
            self._rerender();
            setTimeout(() => {
              const snapTab = document.querySelector('#cp-tabs .tab-item[data-tab="snapshots"]');
              if (snapTab) snapTab.click();
            }, 50);
          });
        }, 50);
      });
    }

    // ═══════════════════════════════════════════════
    // TAB 4: Change Requests
    // ═══════════════════════════════════════════════

    // ─── Approve / Reject Cost Change Requests ───
    document.querySelectorAll('.ccr-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const req = d.costChangeRequests.find(r => r.id === id);
        if (!req) return;

        App.confirm(`อนุมัติคำขอ ${id}?\n${req.serviceName}: ${req.currentCost} -> ${req.newCost} THB\nเหตุผล: ${req.reason}`, { title: 'ยืนยันการอนุมัติ', confirmText: 'อนุมัติ', cancelText: 'ยกเลิก', type: 'success' }).then(ok => {
          if (!ok) return;

          req.status = 'Approved';
          req.approvedBy = 'Super Admin';

          // Apply the cost change to costConfig
          const cost = d.costConfig.find(c => c.serviceCode === req.serviceCode);
          if (cost) {
            cost.costPerUnit = req.newCost;
            cost.effectiveDate = req.effectiveDate;
          }

          self._rerender();
          setTimeout(() => {
            const crTab = document.querySelector('#cp-tabs .tab-item[data-tab="change-requests"]');
            if (crTab) crTab.click();
          }, 50);
        });
      });
    });

    document.querySelectorAll('.ccr-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const req = d.costChangeRequests.find(r => r.id === id);
        if (!req) return;

        App.confirm(`ปฏิเสธคำขอ ${id}?\n${req.serviceName}: ${req.currentCost} -> ${req.newCost} THB`, { title: 'ยืนยันการปฏิเสธ', confirmText: 'ปฏิเสธ', cancelText: 'ยกเลิก', type: 'danger' }).then(ok => {
          if (!ok) return;

          req.status = 'Rejected';
          req.approvedBy = 'Super Admin';

          self._rerender();
          setTimeout(() => {
            const crTab = document.querySelector('#cp-tabs .tab-item[data-tab="change-requests"]');
            if (crTab) crTab.click();
          }, 50);
        });
      });
    });

    // ─── Approve / Reject Margin Change Requests ───
    document.querySelectorAll('.mcr-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const req = d.marginChangeRequests.find(r => r.id === id);
        if (!req) return;

        App.confirm(`อนุมัติคำขอ ${id}?\n${req.target}: ${req.currentMargin}% -> ${req.newMargin}%\nเหตุผล: ${req.reason}`, { title: 'ยืนยันการอนุมัติ', confirmText: 'อนุมัติ', cancelText: 'ยกเลิก', type: 'success' }).then(ok => {
          if (!ok) return;

          req.status = 'Approved';
          req.approvedBy = 'Super Admin';

          // Apply the margin change
          if (req.level === 'Service Code') {
            const sc = d.marginConfig.serviceCodes.find(s => s.code === req.target);
            if (sc) {
              sc.margin = req.newMargin;
            }
          } else if (req.level === 'Global') {
            d.marginConfig.global = req.newMargin;
          } else if (req.level === 'Provider') {
            const provider = d.marginConfig.providers.find(p => p.name === req.target);
            if (provider) {
              provider.margin = req.newMargin;
            }
          }

          self._rerender();
          setTimeout(() => {
            const crTab = document.querySelector('#cp-tabs .tab-item[data-tab="change-requests"]');
            if (crTab) crTab.click();
          }, 50);
        });
      });
    });

    document.querySelectorAll('.mcr-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const req = d.marginChangeRequests.find(r => r.id === id);
        if (!req) return;

        App.confirm(`ปฏิเสธคำขอ ${id}?\n${req.target}: ${req.currentMargin}% -> ${req.newMargin}%`, { title: 'ยืนยันการปฏิเสธ', confirmText: 'ปฏิเสธ', cancelText: 'ยกเลิก', type: 'danger' }).then(ok => {
          if (!ok) return;

          req.status = 'Rejected';
          req.approvedBy = 'Super Admin';

          self._rerender();
          setTimeout(() => {
            const crTab = document.querySelector('#cp-tabs .tab-item[data-tab="change-requests"]');
            if (crTab) crTab.click();
          }, 50);
        });
      });
    });

    // ─── Export Button ───
    const btnExport = document.getElementById('btn-export-pricing');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const rows = [
          ['Service Code', 'Name', 'Billing Type', 'Cost Per Unit', 'Currency', 'Effective Date', 'Status', 'Margin %', 'Sell Price'],
          ...d.costConfig.map(c => {
            const scOverride = d.marginConfig.serviceCodes.find(sc => sc.code === c.serviceCode);
            const margin = scOverride ? scOverride.margin : d.marginConfig.global;
            const sell = c.costPerUnit / (1 - margin / 100);
            return [
              c.serviceCode,
              `"${c.name}"`,
              c.billingType,
              c.costPerUnit,
              c.currency,
              c.effectiveDate,
              c.status,
              margin,
              sell.toFixed(4),
            ];
          }),
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost-pricing_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }
};
