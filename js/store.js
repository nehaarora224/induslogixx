// IndusLogix shared data/state layer.
// Plain vanilla JS (no build step) — loaded before support.js so window.IndusStore
// is ready before any page's Component class constructs. Backed by localStorage so
// state survives navigation (this app is a real multi-page site, not an SPA) and
// browser refresh. Each page reads the collections it needs via IndusStore.getX()
// and writes back through IndusStore.addX()/updateX() — full page navigation after
// a write is what makes the change visible on the next screen.
(function () {
  "use strict";

  var KEY = "induslogix:v1";

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function seedData() {
    return {
      seq: { shipment: 1034, driver: 42, vehicle: 42, exception: 13 },

      // Same demo shipments already shown across Dashboard / Shipments / Reports,
      // now centralized so a created shipment shows up everywhere consistently.
      shipments: [
        { id: '#SH-1024', customer: 'ABC Retail', destination: 'Gurgaon', vehicle: 'TRK-024', driver: 'Rahul Mehta', eta: '11:40 AM', status: 'In Transit', orderNo: 'ORD-2026-0901', type: 'Standard', priority: 'Normal', pickupLocation: 'Delhi — Okhla Hub', pickupAddress: 'Plot 14, Okhla Phase II, New Delhi 110020', pickupContact: 'Sandeep Rawat', pickupPhone: '+91 98110 44231', pickupWhen: '2026-09-07T08:10', deliveryLocation: 'Gurgaon — Udyog Vihar', deliveryAddress: 'Udyog Vihar Phase 3, Gurgaon 122016', deliveryContact: 'ABC Retail Stores', deliveryPhone: '+91 98110 55231', deliveryWhen: '2026-09-07T11:40', packages: '18', weight: '640', packType: 'Cartons', notes: 'Handle with care — glassware.', route: 'RT-07 Delhi → Gurugram', createdAt: '2026-09-07T07:40:00' },
        { id: '#SH-1025', customer: 'XYZ Stores', destination: 'Noida', vehicle: 'TRK-018', driver: 'Amit Kumar', eta: '12:15 PM', status: 'Delayed', orderNo: 'ORD-2026-0902', type: 'Standard', priority: 'High', pickupLocation: 'Delhi — Okhla Hub', pickupAddress: 'Plot 14, Okhla Phase II, New Delhi 110020', pickupContact: 'Sandeep Rawat', pickupPhone: '+91 98110 44231', pickupWhen: '2026-09-07T08:30', deliveryLocation: 'Noida — Sector 62', deliveryAddress: 'Sector 62, Noida 201309', deliveryContact: 'XYZ Stores', deliveryPhone: '+91 98110 55232', deliveryWhen: '2026-09-07T12:15', packages: '9', weight: '310', packType: 'Pallets', notes: '', route: 'RT-11 Delhi → Noida', createdAt: '2026-09-07T07:55:00' },
        { id: '#SH-1026', customer: 'Metro Supplies', destination: 'Faridabad', vehicle: 'TRK-031', driver: 'Rohan Singh', eta: '1:00 PM', status: 'Out for Delivery', orderNo: 'ORD-2026-0903', type: 'Express', priority: 'Normal', pickupLocation: 'Gurugram — Sector 34 Depot', pickupAddress: 'Sector 34 Industrial Area, Gurugram', pickupContact: 'Manoj Tiwari', pickupPhone: '+91 98110 44232', pickupWhen: '2026-09-07T09:00', deliveryLocation: 'Faridabad', deliveryAddress: 'Sector 21, Faridabad', deliveryContact: 'Metro Supplies', deliveryPhone: '+91 98110 55233', deliveryWhen: '2026-09-07T13:00', packages: '22', weight: '890', packType: 'Crates', notes: '', route: 'RT-14 Delhi → Ghaziabad', createdAt: '2026-09-07T08:10:00' },
        { id: '#SH-1027', customer: 'Delhi Wholesale', destination: 'Ghaziabad', vehicle: 'TRK-011', driver: 'Vikram Singh', eta: '2:30 PM', status: 'Pending', orderNo: 'ORD-2026-0904', type: 'Standard', priority: 'Normal', pickupLocation: 'Delhi — Okhla Hub', pickupAddress: 'Plot 14, Okhla Phase II, New Delhi 110020', pickupContact: 'Sandeep Rawat', pickupPhone: '+91 98110 44231', pickupWhen: '2026-09-07T10:00', deliveryLocation: 'Ghaziabad — Sahibabad', deliveryAddress: 'Sahibabad Industrial Area, Ghaziabad', deliveryContact: 'Delhi Wholesale', deliveryPhone: '+91 98110 55234', deliveryWhen: '2026-09-07T14:30', packages: '14', weight: '520', packType: 'Cartons', notes: '', route: 'RT-14 Delhi → Ghaziabad', createdAt: '2026-09-07T09:30:00' },
        { id: '#SH-1028', customer: 'Prime Distributors', destination: 'Delhi', vehicle: 'TRK-019', driver: 'Arjun Sharma', eta: '3:15 PM', status: 'Delivered', orderNo: 'ORD-2026-0905', type: 'Standard', priority: 'Normal', pickupLocation: 'Noida — Phase II Warehouse', pickupAddress: 'Phase II, Noida', pickupContact: 'Ritu Bansal', pickupPhone: '+91 98110 44233', pickupWhen: '2026-09-07T09:45', deliveryLocation: 'Delhi', deliveryAddress: 'Connaught Place, New Delhi', deliveryContact: 'Prime Distributors', deliveryPhone: '+91 98110 55235', deliveryWhen: '2026-09-07T15:15', packages: '11', weight: '410', packType: 'Cartons', notes: '', route: 'RT-07 Delhi → Gurugram', createdAt: '2026-09-07T09:00:00' },
        { id: '#SH-1029', customer: 'Sunrise Foods', destination: 'Sonipat', vehicle: 'TRK-007', driver: 'Kabir Anand', eta: '3:50 PM', status: 'In Transit', orderNo: 'ORD-2026-0906', type: 'Express', priority: 'High', pickupLocation: 'Delhi — Okhla Hub', pickupAddress: 'Plot 14, Okhla Phase II, New Delhi 110020', pickupContact: 'Sandeep Rawat', pickupPhone: '+91 98110 44231', pickupWhen: '2026-09-07T10:20', deliveryLocation: 'Sonipat — Kundli', deliveryAddress: 'Kundli Industrial Area, Sonipat', deliveryContact: 'Sunrise Foods', deliveryPhone: '+91 98110 55236', deliveryWhen: '2026-09-07T15:50', packages: '30', weight: '1120', packType: 'Pallets', notes: 'Temperature-sensitive — keep below 8°C.', route: 'RT-22 Delhi → Sonipat', createdAt: '2026-09-07T09:45:00' },
        { id: '#SH-1030', customer: 'Vertex Pharma', destination: 'Delhi · Okhla', vehicle: 'TRK-022', driver: 'Neha Rawat', eta: '4:20 PM', status: 'Delayed', orderNo: 'ORD-2026-0907', type: 'Express', priority: 'Critical', pickupLocation: 'Ghaziabad — Site IV', pickupAddress: 'Site IV, Sahibabad, Ghaziabad', pickupContact: 'Vivek Chauhan', pickupPhone: '+91 98110 44234', pickupWhen: '2026-09-07T10:40', deliveryLocation: 'Delhi — Okhla Hub', deliveryAddress: 'Okhla Phase II, New Delhi', deliveryContact: 'Vertex Pharma', deliveryPhone: '+91 98110 55237', deliveryWhen: '2026-09-07T16:20', packages: '6', weight: '95', packType: 'Crates', notes: 'Pharmaceutical cold-chain shipment.', route: 'RT-14 Delhi → Ghaziabad', createdAt: '2026-09-07T10:05:00' },
        { id: '#SH-1031', customer: 'Northline Traders', destination: 'Meerut', vehicle: 'TRK-014', driver: 'Suresh Yadav', eta: '5:05 PM', status: 'In Transit', orderNo: 'ORD-2026-0908', type: 'Standard', priority: 'Normal', pickupLocation: 'Delhi — Okhla Hub', pickupAddress: 'Plot 14, Okhla Phase II, New Delhi 110020', pickupContact: 'Sandeep Rawat', pickupPhone: '+91 98110 44231', pickupWhen: '2026-09-07T11:00', deliveryLocation: 'Meerut', deliveryAddress: 'Delhi Road, Meerut', deliveryContact: 'Northline Traders', deliveryPhone: '+91 98110 55238', deliveryWhen: '2026-09-07T17:05', packages: '17', weight: '630', packType: 'Cartons', notes: '', route: 'RT-22 Delhi → Sonipat', createdAt: '2026-09-07T10:30:00' },
        { id: '#SH-1032', customer: 'Kraft Interiors', destination: 'Gurgaon · Sec 44', vehicle: 'TRK-009', driver: 'Imran Qureshi', eta: '5:40 PM', status: 'Out for Delivery', orderNo: 'ORD-2026-0909', type: 'Standard', priority: 'Normal', pickupLocation: 'Gurugram — Sector 34 Depot', pickupAddress: 'Sector 34 Industrial Area, Gurugram', pickupContact: 'Manoj Tiwari', pickupPhone: '+91 98110 44232', pickupWhen: '2026-09-07T11:20', deliveryLocation: 'Gurugram — Udyog Vihar', deliveryAddress: 'Sector 44, Gurgaon', deliveryContact: 'Kraft Interiors', deliveryPhone: '+91 98110 55239', deliveryWhen: '2026-09-07T17:40', packages: '25', weight: '980', packType: 'Crates', notes: '', route: 'RT-07 Delhi → Gurugram', createdAt: '2026-09-07T10:50:00' },
        { id: '#SH-1033', customer: 'Ganga Textiles', destination: 'Noida · Phase 2', vehicle: 'TRK-005', driver: 'Deepak Verma', eta: '6:10 PM', status: 'Delivered', orderNo: 'ORD-2026-0910', type: 'Standard', priority: 'Normal', pickupLocation: 'Noida — Phase II Warehouse', pickupAddress: 'Phase II, Noida', pickupContact: 'Ritu Bansal', pickupPhone: '+91 98110 44233', pickupWhen: '2026-09-07T11:40', deliveryLocation: 'Noida — Sector 62', deliveryAddress: 'Phase 2, Noida', deliveryContact: 'Ganga Textiles', deliveryPhone: '+91 98110 55240', deliveryWhen: '2026-09-07T18:10', packages: '13', weight: '470', packType: 'Cartons', notes: '', route: 'RT-11 Delhi → Noida', createdAt: '2026-09-07T11:10:00' }
      ],

      drivers: [
        { name: 'Amit Verma', id: 'DR-018', vehicle: 'VH-018', location: 'Gurugram', shipment: 'SHP-10482', status: 'On Route', deliveries: 4, license: 'Expiring soon', experience: 'Over 5 years', phone: '+91 98100 4018', email: 'amit.verma@induslogix.com' },
        { name: 'Rahul Sharma', id: 'DR-024', vehicle: 'VH-024', location: 'Delhi NCR', shipment: '—', status: 'Available', deliveries: 0, license: 'Valid', experience: '2–5 years', phone: '+91 98100 4024', email: 'rahul.sharma@induslogix.com' },
        { name: 'Rohan Mehta', id: 'DR-031', vehicle: 'VH-031', location: 'Noida', shipment: '—', status: 'Available', deliveries: 2, license: 'Valid', experience: 'Under 2 years', phone: '+91 98100 4031', email: 'rohan.mehta@induslogix.com' },
        { name: 'Vikram Singh', id: 'DR-012', vehicle: 'VH-012', location: 'Delhi', shipment: 'SHP-10491', status: 'On Route', deliveries: 5, license: 'Valid', experience: 'Over 5 years', phone: '+91 98100 4012', email: 'vikram.singh@induslogix.com' },
        { name: 'Kabir Anand', id: 'DR-007', vehicle: 'VH-007', location: 'Delhi NCR', shipment: 'SHP-10488', status: 'On Route', deliveries: 3, license: 'Valid', experience: '2–5 years', phone: '+91 98100 4007', email: 'kabir.anand@induslogix.com' },
        { name: 'Neha Rawat', id: 'DR-014', vehicle: 'VH-014', location: 'Faridabad', shipment: '—', status: 'Off Duty', deliveries: 0, license: 'Valid', experience: '2–5 years', phone: '+91 98100 4014', email: 'neha.rawat@induslogix.com' },
        { name: 'Arjun Sharma', id: 'DR-019', vehicle: 'VH-019', location: 'Delhi', shipment: '—', status: 'Available', deliveries: 1, license: 'Valid', experience: 'Over 5 years', phone: '+91 98100 4019', email: 'arjun.sharma@induslogix.com' },
        { name: 'Deepak Verma', id: 'DR-027', vehicle: 'VH-027', location: 'Noida', shipment: '—', status: 'Available', deliveries: 2, license: 'Expired', experience: 'Under 2 years', phone: '+91 98100 4027', email: 'deepak.verma@induslogix.com' },
        { name: 'Imran Qureshi', id: 'DR-033', vehicle: 'VH-033', location: 'Gurugram', shipment: 'SHP-10494', status: 'On Route', deliveries: 4, license: 'Valid', experience: '2–5 years', phone: '+91 98100 4033', email: 'imran.qureshi@induslogix.com' },
        { name: 'Suresh Yadav', id: 'DR-041', vehicle: 'Unassigned', location: 'Delhi NCR', shipment: '—', status: 'Unavailable', deliveries: 0, license: 'Valid', experience: 'Over 5 years', phone: '+91 98100 4041', email: 'suresh.yadav@induslogix.com' }
      ],

      vehicles: [
        { id: 'VH-024', reg: 'DL 01 AB 4521', type: 'Truck', driver: 'Rahul Sharma', location: 'Delhi NCR', status: 'Available', shipment: '—' },
        { id: 'VH-018', reg: 'HR 26 CF 7821', type: 'Container Truck', driver: 'Amit Verma', location: 'Gurugram', status: 'In Transit', shipment: 'SHP-10482' },
        { id: 'VH-031', reg: 'UP 16 DK 2934', type: 'Van', driver: 'Rohan Mehta', location: 'Noida', status: 'Maintenance', shipment: '—' },
        { id: 'VH-011', reg: 'DL 05 CE 9182', type: 'Truck', driver: 'Unassigned', location: 'Delhi', status: 'Unavailable', shipment: '—' },
        { id: 'VH-007', reg: 'DL 03 BR 1140', type: 'Container Truck', driver: 'Kabir Anand', location: 'Delhi NCR', status: 'In Transit', shipment: 'SHP-10488' },
        { id: 'VH-014', reg: 'HR 55 AL 3308', type: 'Mini Truck', driver: 'Neha Rawat', location: 'Faridabad', status: 'Maintenance', shipment: '—' },
        { id: 'VH-019', reg: 'DL 08 CN 6642', type: 'Truck', driver: 'Arjun Sharma', location: 'Delhi', status: 'Available', shipment: '—' },
        { id: 'VH-027', reg: 'UP 14 EE 5510', type: 'Van', driver: 'Deepak Verma', location: 'Noida', status: 'Available', shipment: '—' },
        { id: 'VH-033', reg: 'HR 26 DA 9075', type: 'Truck', driver: 'Imran Qureshi', location: 'Gurugram', status: 'In Transit', shipment: 'SHP-10491' },
        { id: 'VH-041', reg: 'DL 01 CH 2287', type: 'Mini Truck', driver: 'Suresh Yadav', location: 'Delhi NCR', status: 'Available', shipment: '—' }
      ],

      exceptions: [
        { id: 'EXC-1001', type: 'Delayed Shipment', severity: 'Critical', status: 'Open', shipmentId: '#SH-1025', driverId: 'DR-024', vehicleId: 'VH-018', title: 'Shipment #SH-1025 delayed 48+ minutes', description: 'Traffic congestion on NH-9 near Noida toll — vehicle running well behind schedule. Customer notified.', location: 'Noida', createdAt: '2026-09-07T10:55:00', resolvedAt: null, assignee: 'Niharika A.' },
        { id: 'EXC-1002', type: 'Vehicle Breakdown', severity: 'High', status: 'In Progress', shipmentId: '#SH-1030', driverId: 'DR-031', vehicleId: 'VH-031', title: 'VH-031 reported engine warning light', description: 'Driver pulled over near Noida depot. Roadside assistance dispatched, ETA 40 min.', location: 'Noida depot', createdAt: '2026-09-07T09:20:00', resolvedAt: null, assignee: 'Fleet team' },
        { id: 'EXC-1003', type: 'Delivery Failed', severity: 'High', status: 'Open', shipmentId: '#SH-1027', driverId: 'DR-012', vehicleId: 'VH-011', title: 'Recipient unavailable for #SH-1027', description: 'Two delivery attempts made — recipient not reachable. Needs a reattempt window today.', location: 'Ghaziabad — Sahibabad', createdAt: '2026-09-07T13:10:00', resolvedAt: null, assignee: 'Niharika A.' },
        { id: 'EXC-1004', type: 'Route Deviation', severity: 'Warning', status: 'In Progress', shipmentId: '#SH-1029', driverId: 'DR-007', vehicleId: 'VH-007', title: 'VH-007 deviated from planned route', description: 'Vehicle re-routed around a road closure on RT-22. 12 minutes added to ETA — auto-adjusted.', location: 'Sonipat Road', createdAt: '2026-09-07T11:35:00', resolvedAt: null, assignee: 'Dispatch' },
        { id: 'EXC-1005', type: 'Driver Issue', severity: 'Warning', status: 'Open', shipmentId: '—', driverId: 'DR-018', vehicleId: 'VH-018', title: 'Driver license expiring in 12 days', description: 'Amit Verma’s driving license renewal is due — schedule document verification before expiry.', location: 'Gurugram', createdAt: '2026-09-06T09:00:00', resolvedAt: null, assignee: 'HR / Compliance' },
        { id: 'EXC-1006', type: 'Address Problem', severity: 'Warning', status: 'Open', shipmentId: '#SH-1032', driverId: 'DR-033', vehicleId: 'VH-033', title: 'Delivery address incomplete for #SH-1032', description: 'Landmark and PIN code missing on the delivery address — driver requesting confirmation.', location: 'Gurgaon · Sector 44', createdAt: '2026-09-07T12:40:00', resolvedAt: null, assignee: 'Customer support' },
        { id: 'EXC-1007', type: 'Temperature Excursion', severity: 'Critical', status: 'Escalated', shipmentId: '#SH-1029', driverId: 'DR-007', vehicleId: 'VH-007', title: 'Cold-chain shipment above threshold', description: 'Trailer temperature reached 9.4°C against an 8°C limit for 6 minutes. Reefer unit reset; monitoring closely.', location: 'Sonipat Road', createdAt: '2026-09-07T12:05:00', resolvedAt: null, assignee: 'Quality team' },
        { id: 'EXC-1008', type: 'Delayed Shipment', severity: 'High', status: 'Resolved', shipmentId: '#SH-1024', driverId: 'DR-024', vehicleId: 'VH-024', title: 'Shipment #SH-1024 delayed at dispatch', description: 'Loading delay at Okhla hub pushed dispatch back 25 minutes. Recovered en route — back on schedule.', location: 'Delhi — Okhla Hub', createdAt: '2026-09-07T08:05:00', resolvedAt: '2026-09-07T09:10:00', assignee: 'Dispatch' },
        { id: 'EXC-1009', type: 'Vehicle Breakdown', severity: 'Warning', status: 'Resolved', shipmentId: '—', driverId: 'DR-014', vehicleId: 'VH-014', title: 'VH-014 scheduled maintenance overdue', description: 'Brake inspection was 3 days overdue — vehicle taken offline and serviced.', location: 'Faridabad', createdAt: '2026-09-05T14:20:00', resolvedAt: '2026-09-06T11:00:00', assignee: 'Fleet team' },
        { id: 'EXC-1010', type: 'Delivery Failed', severity: 'Critical', status: 'Open', shipmentId: '#SH-1030', driverId: 'DR-014', vehicleId: 'VH-022', title: 'Pharma shipment #SH-1030 at risk of missed window', description: 'Critical-priority cold-chain shipment delayed — delivery window closes in under 2 hours.', location: 'Delhi — Okhla', createdAt: '2026-09-07T14:20:00', resolvedAt: null, assignee: 'Niharika A.' },
        { id: 'EXC-1011', type: 'Route Deviation', severity: 'Low', status: 'Resolved', shipmentId: '#SH-1026', driverId: 'DR-031', vehicleId: 'VH-031', title: 'Minor route deviation on RT-14', description: 'Driver took an alternate lane to avoid a market-day closure. No impact on ETA.', location: 'Faridabad', createdAt: '2026-09-06T10:15:00', resolvedAt: '2026-09-06T10:20:00', assignee: 'Dispatch' },
        { id: 'EXC-1012', type: 'Other', severity: 'Low', status: 'Open', shipmentId: '#SH-1033', driverId: 'DR-027', vehicleId: 'VH-027', title: 'Proof of delivery photo unclear', description: 'Uploaded POD photo for #SH-1033 is blurry — requesting a re-upload from the driver app.', location: 'Noida · Phase 2', createdAt: '2026-09-07T11:55:00', resolvedAt: null, assignee: 'Quality team' }
      ],

      user: {
        name: 'Niharika A.',
        role: 'Logistics Manager',
        email: 'niharika.arora@abcmanufacturing.com',
        phone: '+91 98110 22345',
        initials: 'NA',
        department: 'Operations',
        location: 'Delhi NCR, India',
        joined: 'March 2023',
        notifications: { email: true, sms: false, push: true, delayAlerts: true, exceptionAlerts: true, dailySummary: true }
      },

      settings: {
        companyName: 'ABC Manufacturing Pvt. Ltd.',
        industry: 'Manufacturing',
        location: 'Delhi NCR, India',
        timezone: 'Asia/Kolkata (GMT+5:30)',
        units: 'Metric (km, kg)',
        currency: 'INR (₹)',
        fleetModel: 'Own Fleet',
        deliveryHours: 'Business hours',
        theme: 'Light',
        dispatchApprovals: false,
        autoAssignVehicles: true,
        podRequired: 'Signature'
      }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.shipments) return parsed;
      }
    } catch (e) { /* ignore — fall through to reseed */ }
    var seeded = seedData();
    persist(seeded);
    return seeded;
  }

  var state = load();

  function persist(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ }
  }
  function commit() { persist(state); }

  function findIndex(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return -1;
  }

  // ---- CSV export helper -------------------------------------------------
  function toCSV(columns, rows) {
    function esc(v) {
      var s = v === null || v === undefined ? '' : String(v);
      if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var lines = [columns.map(function (c) { return esc(c.label); }).join(',')];
    rows.forEach(function (row) {
      lines.push(columns.map(function (c) { return esc(row[c.key]); }).join(','));
    });
    return lines.join('\r\n');
  }
  function downloadCSV(filename, columns, rows) {
    var csv = toCSV(columns, rows);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var IndusStore = {
    // Shared sidebar destination map — every page's nav item resolves through
    // this so adding/renaming a route only happens in one place.
    NAV_MAP: {
      Overview: 'dashboard.html', Shipments: 'shipments.html', Routes: 'dashboard.html',
      Vehicles: 'vehicles.html', Drivers: 'drivers.html', Tracking: 'tracking.html',
      Exceptions: 'exceptions.html', Reports: 'reports.html'
    },

    qs: function (name) {
      try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
    },

    // ---- Shipments --------------------------------------------------------
    getShipments: function () { return clone(state.shipments); },
    getShipment: function (id) {
      var s = state.shipments.find(function (x) { return x.id === id; });
      return s ? clone(s) : null;
    },
    addShipment: function (data) {
      var id = '#SH-' + (state.seq.shipment++);
      var s = Object.assign({
        id: id, status: 'Pending', vehicle: '—', driver: 'Unassigned',
        createdAt: new Date().toISOString()
      }, data, { id: id });
      state.shipments.unshift(s);
      commit();
      return clone(s);
    },
    updateShipment: function (id, patch) {
      var i = findIndex(state.shipments, id);
      if (i === -1) return null;
      state.shipments[i] = Object.assign({}, state.shipments[i], patch);
      commit();
      return clone(state.shipments[i]);
    },

    // ---- Drivers ------------------------------------------------------------
    getDrivers: function () { return clone(state.drivers); },
    getDriver: function (id) {
      var d = state.drivers.find(function (x) { return x.id === id; });
      return d ? clone(d) : null;
    },
    addDriver: function (data) {
      var d = Object.assign({ shipment: '—', deliveries: 0, status: 'Available' }, data);
      state.drivers.unshift(d);
      commit();
      return clone(d);
    },
    updateDriver: function (id, patch) {
      var i = findIndex(state.drivers, id);
      if (i === -1) return null;
      state.drivers[i] = Object.assign({}, state.drivers[i], patch);
      commit();
      return clone(state.drivers[i]);
    },
    nextDriverId: function () { return 'DR-0' + (state.seq.driver++); },

    // ---- Vehicles -----------------------------------------------------------
    getVehicles: function () { return clone(state.vehicles); },
    getVehicle: function (id) {
      var v = state.vehicles.find(function (x) { return x.id === id; });
      return v ? clone(v) : null;
    },
    addVehicle: function (data) {
      var v = Object.assign({ shipment: '—', status: 'Available' }, data);
      state.vehicles.unshift(v);
      commit();
      return clone(v);
    },
    updateVehicle: function (id, patch) {
      var i = findIndex(state.vehicles, id);
      if (i === -1) return null;
      state.vehicles[i] = Object.assign({}, state.vehicles[i], patch);
      commit();
      return clone(state.vehicles[i]);
    },
    nextVehicleId: function () { return 'VH-0' + (state.seq.vehicle++); },

    // ---- Exceptions -----------------------------------------------------------
    getExceptions: function () { return clone(state.exceptions); },
    getException: function (id) {
      var e = state.exceptions.find(function (x) { return x.id === id; });
      return e ? clone(e) : null;
    },
    addException: function (data) {
      var id = 'EXC-' + (state.seq.exception++);
      var e = Object.assign({ status: 'Open', createdAt: new Date().toISOString(), resolvedAt: null }, data, { id: id });
      state.exceptions.unshift(e);
      commit();
      return clone(e);
    },
    updateException: function (id, patch) {
      var i = findIndex(state.exceptions, id);
      if (i === -1) return null;
      state.exceptions[i] = Object.assign({}, state.exceptions[i], patch);
      commit();
      return clone(state.exceptions[i]);
    },
    resolveException: function (id) {
      return this.updateException(id, { status: 'Resolved', resolvedAt: new Date().toISOString() });
    },

    // ---- User / settings ------------------------------------------------------
    getUser: function () { return clone(state.user); },
    updateUser: function (patch) { state.user = Object.assign({}, state.user, patch); commit(); return clone(state.user); },
    getSettings: function () { return clone(state.settings); },
    updateSettings: function (patch) { state.settings = Object.assign({}, state.settings, patch); commit(); return clone(state.settings); },

    // ---- Derived aggregates (used by Dashboard / Reports so KPIs move when
    // shipments are created or their status changes) ---------------------------
    counts: function () {
      var ships = state.shipments;
      var byStatus = { Pending: 0, 'In Transit': 0, 'Out for Delivery': 0, Delivered: 0, Delayed: 0 };
      ships.forEach(function (s) { if (byStatus[s.status] === undefined) byStatus[s.status] = 0; byStatus[s.status]++; });
      var total = ships.length;
      var delivered = byStatus.Delivered || 0;
      var openExceptions = state.exceptions.filter(function (e) { return e.status !== 'Resolved'; }).length;
      return {
        total: total,
        byStatus: byStatus,
        inTransit: byStatus['In Transit'] || 0,
        delayed: byStatus.Delayed || 0,
        onTimePct: total ? Math.round((delivered / total) * 1000) / 10 : 0,
        openExceptions: openExceptions,
        driversAvailable: state.drivers.filter(function (d) { return d.status === 'Available'; }).length,
        vehiclesAvailable: state.vehicles.filter(function (v) { return v.status === 'Available'; }).length
      };
    },

    exportCSV: downloadCSV,

    reset: function () { state = seedData(); commit(); }
  };

  window.IndusStore = IndusStore;
})();
