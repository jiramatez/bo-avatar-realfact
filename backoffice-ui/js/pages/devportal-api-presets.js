/* ================================================================
   Page Module — Developer Portal API Presets
   Synced from AI Framework — Admin manages assignment only
   ================================================================ */

window.Pages = window.Pages || {};
window.Pages.dpApiPresets = {

  render() {
    var d = window.MockData;
    var s = d.dpStats;

    return `
      <div class="page-header">
        <h1 class="heading">API PRESETS</h1>
      </div>
      <div class="text-sm text-muted mb-20">API Presets ทั้งหมดถูก sync จาก AI Framework อัตโนมัติ</div>

      <!-- KPI Cards -->
      <div class="grid-4 mb-20">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Total Presets</span>
            <div class="stat-icon blue"><i class="fa-solid fa-puzzle-piece"></i></div>
          </div>
          <div class="stat-value mono">${s.totalApiPresets}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Active</span>
            <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="stat-value mono">${s.activeApiPresets}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Total Agents</span>
            <div class="stat-icon purple"><i class="fa-solid fa-robot"></i></div>
          </div>
          <div class="stat-value mono">${s.totalAgents}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Assigned Tenants</span>
            <div class="stat-icon orange"><i class="fa-solid fa-users"></i></div>
          </div>
          <div class="stat-value mono">${s.activeTenants}</div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex items-center gap-10 mb-16">
        <div class="search-bar flex-1">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="dp-preset-search" placeholder="ค้นหา API Preset...">
        </div>
        <div class="tab-bar" id="dp-preset-tabs">
          <div class="tab-item active" data-tab="all">All</div>
          <div class="tab-item" data-tab="Active">Active</div>
          <div class="tab-item" data-tab="Draft">Draft</div>
          <div class="tab-item" data-tab="Deprecated">Deprecated</div>
        </div>
      </div>

      <div class="table-wrap" id="dp-preset-list"></div>
    `;
  },

  init() {
    var self = this;
    self._renderList();

    document.getElementById('dp-preset-search').addEventListener('input', function() {
      self._renderList();
    });
    document.querySelectorAll('#dp-preset-tabs .tab-item').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('#dp-preset-tabs .tab-item').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        self._renderList();
      });
    });
  },

  _renderList() {
    var d = window.MockData;
    var filter = document.querySelector('#dp-preset-tabs .tab-item.active').dataset.tab;
    var search = document.getElementById('dp-preset-search').value.trim().toLowerCase();

    var presets = d.apiPresets.filter(function(p) {
      if (filter !== 'all' && p.status !== filter) return false;
      if (search && p.name.toLowerCase().indexOf(search) === -1 && p.description.toLowerCase().indexOf(search) === -1) return false;
      return true;
    });

    var html = '<table><thead><tr>' +
      '<th>API Preset</th><th>Version</th><th>Agents</th><th>Assigned Tenants</th><th>Status</th><th>Last Updated</th><th></th>' +
      '</tr></thead><tbody>';

    presets.forEach(function(p) {
      var tenantCount = p.assignedTenants.length;
      var tenantLabel = tenantCount ? tenantCount + ' Tenant' + (tenantCount > 1 ? 's' : '') : '<span class="text-muted">—</span>';

      html += '<tr>' +
        '<td><strong>' + p.name + '</strong>' +
          (p.isDefault ? ' <span class="chip chip-orange"><i class="fa-solid fa-star"></i> Default</span>' : '') +
          '<br><span class="text-muted text-xs">' + p.description + '</span></td>' +
        '<td class="mono">v' + p.version + '</td>' +
        '<td>' + p.agents.length + '</td>' +
        '<td>' + tenantLabel + '</td>' +
        '<td>' + d.statusChip(p.status) + '</td>' +
        '<td class="text-sm">' + p.lastUpdated + '</td>' +
        '<td><button class="btn btn-sm btn-outline" onclick="Pages.dpApiPresets._showDetail(\'' + p.id + '\')"><i class="fa-solid fa-eye"></i></button></td>' +
        '</tr>';
    });

    if (!presets.length) {
      html += '<tr><td colspan="7" style="text-align:center;padding:2rem;" class="text-muted">ไม่พบ API Preset</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('dp-preset-list').innerHTML = html;
  },

  _showDetail(presetId) {
    var d = window.MockData;
    var p = d.apiPresets.find(function(x) { return x.id === presetId; });
    if (!p) return;

    // Agent rows
    var agentRows = '';
    p.agents.forEach(function(a) {
      agentRows += '<tr>' +
        '<td><strong>' + a.name + '</strong></td>' +
        '<td><span class="chip chip-blue">' + a.model + '</span></td>' +
        '<td>' + a.role + '</td>' +
        '</tr>';
    });

    // Assigned Tenant rows
    var tenantRows = '';
    p.assignedTenants.forEach(function(tid) {
      var t = d.dpTenants.find(function(x) { return x.id === tid; });
      if (t) {
        tenantRows += '<tr>' +
          '<td><strong>' + t.name + '</strong></td>' +
          '<td class="mono text-xs">' + t.id + '</td>' +
          '<td class="mono">' + d.formatNumber(t.apiCallsMonth) + '</td>' +
          '</tr>';
      }
    });
    if (!tenantRows) {
      tenantRows = '<tr><td colspan="3" class="text-muted" style="text-align:center;padding:1rem;">ยังไม่มี Tenant ที่ assign</td></tr>';
    }

    var html =
      '<div class="modal modal-wide">' +
        '<button class="modal-close" onclick="App.closeModal()"><i class="fa-solid fa-xmark"></i></button>' +
        '<div class="modal-title">' + p.name + '</div>' +
        '<div class="modal-subtitle">v' + p.version + ' · ' + d.statusChip(p.status) +
          (p.isDefault ? ' · <span class="chip chip-orange"><i class="fa-solid fa-star"></i> Default</span>' : '') +
        '</div>' +

        '<div class="grid-3 gap-12 mb-20">' +
          '<div><span class="text-muted text-xs uppercase">Status</span><br>' + d.statusChip(p.status) + '</div>' +
          '<div><span class="text-muted text-xs uppercase">Last Updated</span><br>' + p.lastUpdated + '</div>' +
          '<div><span class="text-muted text-xs uppercase">Agents</span><br><span class="mono">' + p.agents.length + '</span></div>' +
        '</div>' +

        '<p class="text-muted mb-16">' + p.description + '</p>' +

        '<!-- Agents -->' +
        '<div class="section-title"><i class="fa-solid fa-robot text-primary"></i> Agents (' + p.agents.length + ')</div>' +
        '<div class="table-wrap mb-20"><table><thead><tr><th>Agent Name</th><th>Model</th><th>Role</th></tr></thead>' +
          '<tbody>' + agentRows + '</tbody></table></div>' +

        '<!-- Assigned Tenants -->' +
        '<div class="section-title"><i class="fa-solid fa-users text-muted"></i> Assigned Tenants (' + p.assignedTenants.length + ')</div>' +
        '<div class="table-wrap">' +
          '<table><thead><tr><th>Tenant</th><th>ID</th><th>API Calls/Month</th></tr></thead>' +
          '<tbody>' + tenantRows + '</tbody></table>' +
        '</div>' +

        '<div class="modal-actions">' +
          '<button class="btn btn-outline" onclick="App.closeModal()">ปิด</button>' +
        '</div>' +
      '</div>';

    App.showModal(html);
  },
};
