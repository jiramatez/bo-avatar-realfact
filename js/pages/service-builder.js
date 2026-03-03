/* ================================================================
   Service Builder — Avatar Preset Management
   ================================================================ */

window.Pages = window.Pages || {};
window.Pages.serviceBuilder = {

  // ─── Helper: re-render page in place ───
  _rerender() {
    const ct = document.getElementById('content');
    if (ct) {
      ct.innerHTML = window.Pages.serviceBuilder.render();
      window.Pages.serviceBuilder.init();
    }
  },

  // ─── Helper: build create/edit form HTML ───
  _buildPresetFormHtml(preset) {
    const d = window.MockData;
    const isEdit = !!preset;
    const p = preset || {};

    const kbOptions = d.knowledgeBases.map(kb =>
      `<option value="${kb.id}" ${p.kbId === kb.id ? 'selected' : ''}>${kb.name} (${kb.tenantName})</option>`
    ).join('');

    const avatarList = [
      'Female Thai Professional',
      'Male Thai Formal',
      'Female Thai Casual',
      'Female Thai Medical',
      'Male Thai Hospitality',
    ];
    const voiceList = [
      'Thai Female Warm',
      'Thai Male Standard',
      'Thai Female Friendly',
      'Thai Female Calm',
      'Thai Male Warm',
    ];

    const avatarOptions = avatarList.map(a =>
      `<option value="${a}" ${p.avatarName === a ? 'selected' : ''}>${a}</option>`
    ).join('');

    const voiceOptions = voiceList.map(v =>
      `<option value="${v}" ${p.voiceName === v ? 'selected' : ''}>${v}</option>`
    ).join('');

    const modelChecks = d.deviceModels.filter(m => m.status === 'Active').map(m => {
      const checked = p.compatibleModels && p.compatibleModels.includes(m.id) ? 'checked' : '';
      return `<label class="flex items-center gap-8 mb-8" style="cursor:pointer">
        <input type="checkbox" value="${m.id}" name="compatModels" ${checked}> ${m.name}
      </label>`;
    }).join('');

    const titleText = isEdit
      ? `<i class="fa-solid fa-pen"></i> แก้ไข Preset`
      : `<i class="fa-solid fa-plus"></i> สร้าง Preset ใหม่`;
    const saveBtnText = isEdit ? 'บันทึกการแก้ไข' : 'บันทึก';

    return `
      <div class="modal-content" style="max-width:560px;margin:5vh auto;background:var(--card-bg);border-radius:16px;padding:28px;position:relative;max-height:85vh;overflow-y:auto">
        <button class="btn btn-ghost modal-close-btn" style="position:absolute;top:12px;right:12px" onclick="App.closeModal()">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <h3 class="heading mb-20">${titleText}</h3>

        <div class="form-group mb-16">
          <label class="form-label uppercase">ชื่อ PRESET</label>
          <input type="text" class="form-input w-full" id="pf-name" placeholder="ระบุชื่อ Preset" value="${p.name || ''}">
        </div>

        <div class="form-row mb-16" style="display:flex;gap:12px">
          <div class="form-group" style="flex:1">
            <label class="form-label uppercase">AVATAR</label>
            <select class="form-input w-full" id="pf-avatar">
              <option value="">เลือก Avatar</option>
              ${avatarOptions}
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label uppercase">VOICE</label>
            <select class="form-input w-full" id="pf-voice">
              <option value="">เลือก Voice</option>
              ${voiceOptions}
            </select>
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label uppercase">AGENT PROMPT</label>
          <textarea class="form-input w-full" id="pf-prompt" rows="4" placeholder="ระบุบทบาทของ Agent...">${p.agentPrompt || ''}</textarea>
        </div>

        <!-- System Prompt Preview -->
        <div class="mb-16">
          <button type="button" class="btn btn-ghost btn-sm" id="pf-preview-btn" style="font-size:0.8rem">
            <i class="fa-solid fa-eye"></i> Preview System Prompt
          </button>
          <div id="pf-preview-box" style="display:none;margin-top:8px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:0.85rem;color:var(--text-muted);font-family:monospace;line-height:1.6;white-space:pre-wrap"></div>
        </div>

        <div class="form-group mb-16">
          <label class="form-label uppercase">KNOWLEDGE BASE</label>
          <select class="form-input w-full" id="pf-kb">
            <option value="">ไม่เลือก (ไม่มี KB)</option>
            ${kbOptions}
          </select>
        </div>

        <div class="form-group mb-20">
          <label class="form-label uppercase">รุ่นอุปกรณ์ที่รองรับ</label>
          ${modelChecks}
        </div>

        <div class="divider mb-16"></div>

        <div class="flex justify-end gap-12">
          <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
          <button class="btn btn-primary" id="pf-save-btn">
            <i class="fa-solid fa-check"></i> ${saveBtnText}
          </button>
        </div>
      </div>`;
  },

  render() {
    const d = window.MockData;
    const presets = d.presets;
    const totalPresets = presets.length;
    const activePresets = presets.filter(p => p.status === 'Active').length;
    const defaultPreset = presets.find(p => p.isDefault);

    const avatarIcons = {
      'Female Thai Professional': '<i class="fa-solid fa-user-tie" style="font-size:2rem"></i>',
      'Male Thai Formal': '<i class="fa-solid fa-user" style="font-size:2rem"></i>',
      'Female Thai Casual': '<i class="fa-solid fa-face-smile" style="font-size:2rem"></i>',
      'Female Thai Medical': '<i class="fa-solid fa-user-doctor" style="font-size:2rem"></i>',
      'Male Thai Hospitality': '<i class="fa-solid fa-concierge-bell" style="font-size:2rem"></i>',
    };

    function renderPresetCard(p) {
      const icon = avatarIcons[p.avatarName] || '<i class="fa-solid fa-user-circle" style="font-size:2rem"></i>';
      const chips = [];
      if (p.suggested) chips.push('<span class="chip chip-blue">Suggested</span>');
      if (p.isDefault) chips.push('<span class="chip chip-orange">System Default</span>');

      return `
        <div class="entity-card card-hover ${p.status === 'Draft' ? 'text-muted' : ''}" data-preset-id="${p.id}" style="${p.status === 'Draft' ? 'opacity:0.7' : ''}">
          <div class="entity-thumb flex flex-col items-center gap-8">
            ${icon}
            <div class="flex gap-8 flex-wrap">${chips.join('')}</div>
          </div>
          <div class="entity-body">
            <div class="font-700 mb-4">${p.name}</div>
            <div class="text-muted text-sm mb-4">${p.avatarName} / ${p.voiceName}</div>
            <div class="text-sm">${p.kbName ? '<i class="fa-solid fa-book text-primary"></i> ' + p.kbName : '<span class="text-muted">ไม่มี KB</span>'}</div>
          </div>
          <div class="entity-footer flex items-center justify-between flex-wrap gap-8">
            ${d.statusChip(p.status)}
            <span class="text-sm text-muted"><i class="fa-solid fa-building"></i> <span class="mono">${p.assignedTenants.length}</span> ผู้เช่า</span>
            <span class="text-sm text-muted"><i class="fa-solid fa-display"></i> <span class="mono">${p.compatibleModels.length}</span> รุ่น</span>
          </div>
        </div>`;
    }

    return `
      <div>
        <!-- Page Header -->
        <div class="page-header">
          <h2 class="heading">SERVICE BUILDER</h2>
          <div class="page-header-actions">
            <button class="btn btn-primary" id="btn-create-preset">
              <i class="fa-solid fa-plus"></i> สร้าง Preset
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid-3 gap-20 mb-24">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon blue"><i class="fa-solid fa-layer-group"></i></span>
            </div>
            <div class="stat-value mono">${d.formatNumber(totalPresets)}</div>
            <div class="stat-label uppercase">สร้างแล้วทั้งหมด</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon green"><i class="fa-solid fa-circle-check"></i></span>
            </div>
            <div class="stat-value mono">${d.formatNumber(activePresets)}</div>
            <div class="stat-label uppercase">PRESET ที่ใช้งาน</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon orange"><i class="fa-solid fa-star"></i></span>
            </div>
            <div class="stat-value text-sm">${defaultPreset ? defaultPreset.name : '-'}</div>
            <div class="stat-label uppercase">SYSTEM DEFAULT</div>
          </div>
        </div>

        <!-- Tab Bar -->
        <div class="tab-bar mb-20">
          <div class="tab-item active" data-tab="all">ทั้งหมด</div>
          <div class="tab-item" data-tab="assigned">ถูกกำหนดแล้ว</div>
          <div class="tab-item" data-tab="default">System Default</div>
        </div>

        <!-- Preset Grid -->
        <div class="grid-3 gap-20" id="preset-grid">
          ${presets.map(p => renderPresetCard(p)).join('')}
        </div>
      </div>`;
  },

  init() {
    const d = window.MockData;
    const presets = d.presets;
    const self = window.Pages.serviceBuilder;

    const avatarIcons = {
      'Female Thai Professional': '<i class="fa-solid fa-user-tie" style="font-size:2rem"></i>',
      'Male Thai Formal': '<i class="fa-solid fa-user" style="font-size:2rem"></i>',
      'Female Thai Casual': '<i class="fa-solid fa-face-smile" style="font-size:2rem"></i>',
      'Female Thai Medical': '<i class="fa-solid fa-user-doctor" style="font-size:2rem"></i>',
      'Male Thai Hospitality': '<i class="fa-solid fa-concierge-bell" style="font-size:2rem"></i>',
    };

    // ─── Tab Switching ───
    document.querySelectorAll('.tab-item[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item[data-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.tab;
        const cards = document.querySelectorAll('#preset-grid .entity-card');
        cards.forEach(card => {
          const id = card.dataset.presetId;
          const preset = presets.find(p => p.id === id);
          if (!preset) return;

          let show = true;
          if (filter === 'assigned') show = preset.assignedTenants.length > 0;
          if (filter === 'default') show = !!preset.isDefault;

          card.style.display = show ? '' : 'none';
        });
      });
    });

    // ─── Bind system prompt preview inside active modal ───
    function bindPreviewBtn() {
      const previewBtn = document.getElementById('pf-preview-btn');
      const previewBox = document.getElementById('pf-preview-box');
      if (previewBtn && previewBox) {
        previewBtn.addEventListener('click', () => {
          const promptVal = (document.getElementById('pf-prompt') || {}).value || '';
          const assembled = `คุณคือ ${promptVal || '{inject_input}'} ตอบคำถามเป็นภาษาไทย สุภาพและเป็นมิตร`;
          if (previewBox.style.display === 'none') {
            previewBox.textContent = assembled;
            previewBox.style.display = 'block';
            previewBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> ซ่อน System Prompt';
          } else {
            previewBox.style.display = 'none';
            previewBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Preview System Prompt';
          }
        });
      }
    }

    // ─── Open detail modal for a preset ───
    function openDetailModal(p) {
      const tenantNames = p.assignedTenants.map(tid => {
        const t = d.tenants.find(tn => tn.id === tid);
        return t ? t.name : tid;
      });

      const modelNames = p.compatibleModels.map(mid => {
        const m = d.deviceModels.find(dm => dm.id === mid);
        return m ? m.name : mid;
      });

      const icon = avatarIcons[p.avatarName] || '<i class="fa-solid fa-user-circle"></i>';
      const isSuggested = !!p.suggested;

      const modalHtml = `
        <div class="modal-content" style="max-width:600px;margin:5vh auto;background:var(--card-bg);border-radius:16px;padding:28px;position:relative;max-height:85vh;overflow-y:auto">
          <button class="btn btn-ghost modal-close-btn" style="position:absolute;top:12px;right:12px" onclick="App.closeModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="flex items-center gap-16 mb-20">
            ${icon}
            <div>
              <h3 class="heading mb-4">${p.name}</h3>
              <div class="text-muted text-sm"><span class="mono">${p.id}</span></div>
            </div>
            <div class="ml-auto">${d.statusChip(p.status)}</div>
          </div>

          <div class="divider mb-16"></div>

          <!-- Avatar -->
          <div class="flex items-start gap-12 mb-16">
            <span class="stat-icon blue" style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px">
              <i class="fa-solid fa-user"></i>
            </span>
            <div>
              <div class="text-xs uppercase text-muted mb-4">AVATAR</div>
              <div class="font-600">${p.avatarName}</div>
            </div>
          </div>

          <!-- Voice -->
          <div class="flex items-start gap-12 mb-16">
            <span class="stat-icon green" style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px">
              <i class="fa-solid fa-microphone"></i>
            </span>
            <div>
              <div class="text-xs uppercase text-muted mb-4">VOICE</div>
              <div class="font-600">${p.voiceName}</div>
            </div>
          </div>

          <!-- Agent -->
          <div class="flex items-start gap-12 mb-16">
            <span class="stat-icon purple" style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px">
              <i class="fa-solid fa-brain"></i>
            </span>
            <div>
              <div class="text-xs uppercase text-muted mb-4">AGENT PROMPT</div>
              <div class="font-600 text-sm" style="line-height:1.6">${p.agentPrompt}</div>
            </div>
          </div>

          <!-- Knowledge Base -->
          <div class="flex items-start gap-12 mb-20">
            <span class="stat-icon orange" style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px">
              <i class="fa-solid fa-book"></i>
            </span>
            <div>
              <div class="text-xs uppercase text-muted mb-4">KNOWLEDGE BASE</div>
              <div class="font-600">${p.kbName || '<span class="text-muted">ไม่มี KB</span>'}</div>
            </div>
          </div>

          <div class="divider mb-16"></div>

          <!-- Assigned Tenants -->
          <div class="mb-16">
            <div class="text-xs uppercase text-muted mb-8"><i class="fa-solid fa-building"></i> ผู้เช่าที่กำหนด</div>
            ${tenantNames.length > 0
              ? tenantNames.map(n => `<span class="chip chip-blue mb-4">${n}</span> `).join('')
              : '<span class="text-muted text-sm">ยังไม่มีผู้เช่า</span>'}
          </div>

          <!-- Compatible Models -->
          <div class="mb-20">
            <div class="text-xs uppercase text-muted mb-8"><i class="fa-solid fa-display"></i> รุ่นอุปกรณ์ที่รองรับ</div>
            ${modelNames.length > 0
              ? modelNames.map(n => `<span class="chip chip-gray mb-4">${n}</span> `).join('')
              : '<span class="text-muted text-sm">ไม่มีข้อมูล</span>'}
          </div>

          <div class="divider mb-16"></div>

          <!-- Suggested Toggle -->
          <div class="flex items-center justify-between mb-16">
            <div>
              <div class="font-600 mb-2">Suggested</div>
              <div class="text-sm text-muted">แสดง Preset นี้เป็นตัวเลือกแนะนำให้ผู้เช่า</div>
            </div>
            <label class="flex items-center gap-8" style="cursor:pointer">
              <div style="position:relative;width:44px;height:24px">
                <input type="checkbox" id="detail-suggested-toggle" ${isSuggested ? 'checked' : ''} style="opacity:0;width:0;height:0;position:absolute">
                <div id="detail-suggested-track" style="position:absolute;inset:0;border-radius:12px;background:${isSuggested ? 'var(--primary)' : 'var(--border)'};transition:background 0.2s;cursor:pointer">
                  <div style="position:absolute;top:2px;left:${isSuggested ? '22px' : '2px'};width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s" id="detail-suggested-thumb"></div>
                </div>
              </div>
              <span class="text-sm font-600" id="detail-suggested-label">${isSuggested ? 'เปิด' : 'ปิด'}</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-12 flex-wrap">
            <button class="btn btn-danger btn-sm" id="detail-btn-delete"><i class="fa-solid fa-trash"></i> ลบ</button>
            <button class="btn btn-outline btn-sm" id="detail-btn-assign"><i class="fa-solid fa-building"></i> Assign ให้ Tenant</button>
            <button class="btn btn-primary btn-sm" id="detail-btn-edit"><i class="fa-solid fa-pen"></i> แก้ไข</button>
          </div>
        </div>`;

      window.App.showModal(modalHtml);

      // Wire suggested toggle
      setTimeout(() => {
        const toggleInput = document.getElementById('detail-suggested-toggle');
        const track = document.getElementById('detail-suggested-track');
        const thumb = document.getElementById('detail-suggested-thumb');
        const label = document.getElementById('detail-suggested-label');

        if (track) {
          track.addEventListener('click', () => {
            const newVal = !p.suggested;
            p.suggested = newVal;
            track.style.background = newVal ? 'var(--primary)' : 'var(--border)';
            thumb.style.left = newVal ? '22px' : '2px';
            label.textContent = newVal ? 'เปิด' : 'ปิด';
            self._rerender();
            // Re-open this modal after re-render
            setTimeout(() => {
              const updatedP = d.presets.find(pr => pr.id === p.id);
              if (updatedP) openDetailModal(updatedP);
            }, 50);
          });
        }

        // Wire Edit button
        const editBtn = document.getElementById('detail-btn-edit');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            App.closeModal();
            openEditModal(p);
          });
        }

        // Wire Delete button
        const deleteBtn = document.getElementById('detail-btn-delete');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            if (p.assignedTenants.length > 0) {
              App.toast(`Preset นี้ถูก Assign ให้ ${p.assignedTenants.length} Tenant อยู่ กรุณา Unassign ก่อนลบ`, 'error');
              return;
            }
            App.confirm(`ยืนยันการลบ Preset "${p.name}" หรือไม่?`, { title: 'ลบ Preset', confirmText: 'ลบ', cancelText: 'ยกเลิก', type: 'danger' }).then(ok => {
              if (!ok) return;
              const idx = d.presets.findIndex(pr => pr.id === p.id);
              if (idx !== -1) d.presets.splice(idx, 1);
              App.closeModal();
              self._rerender();
              App.toast(`ลบ Preset "${p.name}" สำเร็จ`, 'success');
            });
          });
        }

        // Wire Assign button
        const assignBtn = document.getElementById('detail-btn-assign');
        if (assignBtn) {
          assignBtn.addEventListener('click', () => {
            App.closeModal();
            openAssignModal(p);
          });
        }
      }, 50);
    }

    // ─── Open edit modal for a preset ───
    function openEditModal(p) {
      const formHtml = self._buildPresetFormHtml(p);
      window.App.showModal(formHtml);

      setTimeout(() => {
        bindPreviewBtn();

        const saveBtn = document.getElementById('pf-save-btn');
        if (saveBtn) {
          saveBtn.addEventListener('click', () => {
            const name   = (document.getElementById('pf-name') || {}).value || '';
            const avatar = (document.getElementById('pf-avatar') || {}).value || '';
            const voice  = (document.getElementById('pf-voice') || {}).value || '';
            const prompt = (document.getElementById('pf-prompt') || {}).value || '';
            const kbSel  = document.getElementById('pf-kb');
            const kbId   = kbSel ? kbSel.value : '';

            if (!name.trim()) { App.toast('กรุณาระบุชื่อ Preset', 'error'); return; }
            if (!avatar)      { App.toast('กรุณาเลือก Avatar', 'error'); return; }
            if (!voice)       { App.toast('กรุณาเลือก Voice', 'error'); return; }

            const checked = [...document.querySelectorAll('input[name="compatModels"]:checked')].map(c => c.value);
            const kb = kbId ? d.knowledgeBases.find(k => k.id === kbId) : null;

            p.name             = name.trim();
            p.avatarName       = avatar;
            p.voiceName        = voice;
            p.agentPrompt      = prompt.trim();
            p.kbId             = kb ? kb.id : null;
            p.kbName           = kb ? kb.name : null;
            p.compatibleModels = checked;

            App.closeModal();
            self._rerender();
            App.toast(`อัปเดต Preset "${p.name}" สำเร็จ`, 'success');
          });
        }
      }, 50);
    }

    // ─── Open assign-to-tenant modal ───
    function openAssignModal(p) {
      const planSlots = { 'Free': 1, 'Starter': 5, 'Pro': null };
      const activeTenants = d.tenants.filter(t => t.status === 'Active');

      const tenantChecks = activeTenants.map(t => {
        const isAssigned = p.assignedTenants.includes(t.id);
        const slotLimit = planSlots[t.plan];
        const slotLabel = slotLimit === null ? 'ไม่จำกัด' : `${slotLimit} Preset`;
        const slotWarning = slotLimit !== null && !isAssigned
          ? `<span class="text-xs" style="color:#f59e0b"> (Plan: ${t.plan} — สูงสุด ${slotLabel})</span>`
          : `<span class="text-xs text-muted"> (${t.plan} — ${slotLabel})</span>`;
        return `
          <label class="flex items-center gap-10 mb-10" style="cursor:pointer;padding:10px;border-radius:8px;border:1px solid var(--border)">
            <input type="checkbox" name="assignTenant" value="${t.id}" ${isAssigned ? 'checked' : ''}>
            <div>
              <div class="font-600">${t.name}</div>
              <div class="text-xs text-muted">${t.id}${slotWarning}</div>
            </div>
          </label>`;
      }).join('');

      const modalHtml = `
        <div class="modal-content" style="max-width:520px;margin:5vh auto;background:var(--card-bg);border-radius:16px;padding:28px;position:relative;max-height:85vh;overflow-y:auto">
          <button class="btn btn-ghost" style="position:absolute;top:12px;right:12px" onclick="App.closeModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <h3 class="heading mb-4"><i class="fa-solid fa-building"></i> Assign Preset ให้ Tenant</h3>
          <div class="text-muted text-sm mb-20">${p.name}</div>

          <div class="banner-info mb-16" style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;font-size:0.85rem">
            <i class="fa-solid fa-circle-info" style="color:#f59e0b"></i>
            <span style="margin-left:6px">Free = 1 Preset, Starter = 5 Presets, Pro = ไม่จำกัด</span>
          </div>

          <div class="form-group mb-20">
            <label class="form-label uppercase mb-10">เลือก Tenant (Active เท่านั้น)</label>
            ${tenantChecks || '<div class="text-muted text-sm">ไม่มี Tenant ที่ Active</div>'}
          </div>

          <div class="divider mb-16"></div>
          <div class="flex justify-end gap-12">
            <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" id="btn-save-assign"><i class="fa-solid fa-check"></i> บันทึก</button>
          </div>
        </div>`;

      window.App.showModal(modalHtml);

      setTimeout(() => {
        const saveBtn = document.getElementById('btn-save-assign');
        if (saveBtn) {
          saveBtn.addEventListener('click', () => {
            // Validate slot limits
            const selected = [...document.querySelectorAll('input[name="assignTenant"]:checked')].map(c => c.value);
            let limitError = null;
            const planSlots = { 'Free': 1, 'Starter': 5, 'Pro': null };
            for (const tid of selected) {
              const tenant = d.tenants.find(t => t.id === tid);
              if (!tenant) continue;
              const limit = planSlots[tenant.plan];
              if (limit === null) continue;
              // Count how many presets this tenant is currently assigned to (across all presets)
              const currentCount = d.presets.filter(pr => pr.id !== p.id && pr.assignedTenants.includes(tid)).length;
              // +1 for this new assignment (only if not already assigned)
              const alreadyHas = p.assignedTenants.includes(tid);
              const wouldHave = currentCount + 1;
              if (!alreadyHas && wouldHave > limit) {
                limitError = `${tenant.name} (${tenant.plan}) ถึงขีดจำกัด ${limit} Preset แล้ว`;
                break;
              }
            }
            if (limitError) {
              App.toast(limitError, 'warning');
              return;
            }

            p.assignedTenants = selected;
            App.closeModal();
            self._rerender();
            App.toast(`อัปเดตการ Assign สำเร็จ`, 'success');
          });
        }
      }, 50);
    }

    // ─── Preset Card Click -> Detail Modal ───
    document.querySelectorAll('#preset-grid .entity-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.presetId;
        const p = presets.find(pr => pr.id === id);
        if (!p) return;
        openDetailModal(p);
      });
    });

    // ─── Create Preset Button ───
    const createBtn = document.getElementById('btn-create-preset');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const formHtml = self._buildPresetFormHtml(null);
        window.App.showModal(formHtml);

        setTimeout(() => {
          bindPreviewBtn();

          const saveBtn = document.getElementById('pf-save-btn');
          if (saveBtn) {
            saveBtn.addEventListener('click', () => {
              const name   = (document.getElementById('pf-name') || {}).value || '';
              const avatar = (document.getElementById('pf-avatar') || {}).value || '';
              const voice  = (document.getElementById('pf-voice') || {}).value || '';
              const prompt = (document.getElementById('pf-prompt') || {}).value || '';
              const kbSel  = document.getElementById('pf-kb');
              const kbId   = kbSel ? kbSel.value : '';

              if (!name.trim()) { App.toast('กรุณาระบุชื่อ Preset', 'error'); return; }
              if (!avatar)      { App.toast('กรุณาเลือก Avatar', 'error'); return; }
              if (!voice)       { App.toast('กรุณาเลือก Voice', 'error'); return; }

              const checked = [...document.querySelectorAll('input[name="compatModels"]:checked')].map(c => c.value);
              const kb = kbId ? d.knowledgeBases.find(k => k.id === kbId) : null;

              // Generate new ID
              const maxId = d.presets.reduce((max, p) => {
                const n = parseInt(p.id.replace('P-', ''), 10) || 0;
                return Math.max(max, n);
              }, 0);
              const newId = `P-${String(maxId + 1).padStart(3, '0')}`;

              const newPreset = {
                id: newId,
                name: name.trim(),
                avatarName: avatar,
                voiceName: voice,
                agentPrompt: prompt.trim(),
                kbId: kb ? kb.id : null,
                kbName: kb ? kb.name : null,
                assignedTenants: [],
                compatibleModels: checked,
                suggested: false,
                status: 'Active',
              };

              d.presets.push(newPreset);
              App.closeModal();
              self._rerender();
              App.toast(`สร้าง Preset "${newPreset.name}" สำเร็จ`, 'success');
            });
          }
        }, 50);
      });
    }
  }
};
