require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const ChecklistTemplate = require('../models/ChecklistTemplate');
const Job = require('../models/Job');
const SystemType = require('../models/SystemType');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await ChecklistTemplate.deleteMany({});
  await Job.deleteMany({});
  await SystemType.deleteMany({});
  console.log('Cleared existing data');

  // ── Create Users ──────────────────────────────────────
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@rededge.com',
    password: 'password123',
    role: 'admin',
    phone: '0400000000',
  });

  const mike = await User.create({
    name: 'Mike Johnson',
    email: 'mike.johnson@rededge.com',
    password: 'password123',
    role: 'installer',
    phone: '0411111111',
  });

  const tom = await User.create({
    name: 'Tom Wilson',
    email: 'tom.wilson@rededge.com',
    password: 'password123',
    role: 'installer',
    phone: '0422222222',
  });

  const lisa = await User.create({
    name: 'Lisa Chen',
    email: 'lisa.chen@rededge.com',
    password: 'password123',
    role: 'installer',
    phone: '0433333333',
  });

  console.log('Created users: admin, mike, tom, lisa');

  // ── Create System Types ───────────────────────────────
  const systemTypeNames = [
    'Hemisphere VR1000 Dozer',
    'Hemisphere VR1000 Excavator',
    'Stonex STX-DIG Excavator',
    'Stonex STX-DIG Dozer',
  ];
  for (const name of systemTypeNames) {
    await SystemType.create({ name, createdBy: admin._id });
  }
  console.log('Created 4 system types');

  // ── Create Checklist Templates ────────────────────────

  // ═══════════════════════════════════════════════════════
  // HEMISPHERE VR1000 DOZER - Comprehensive Checklist
  // ═══════════════════════════════════════════════════════
  const hemisphereDozerSteps = [
    // Section 1: Job & Machine Information (Pre-Start)
    { number: 1, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Installer Name', inputType: 'text', inputLabel: 'Installer Name', requiresPhoto: false },
    { number: 2, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Company', inputType: 'text', inputLabel: 'Company', requiresPhoto: false },
    { number: 3, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Customer Name', inputType: 'text', inputLabel: 'Customer Name', requiresPhoto: false },
    { number: 4, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Make', inputType: 'text', inputLabel: 'Machine Make', requiresPhoto: false },
    { number: 5, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Model', inputType: 'text', inputLabel: 'Machine Model', requiresPhoto: false },
    { number: 6, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Serial Number', inputType: 'text', inputLabel: 'Machine Serial Number', requiresPhoto: false },
    { number: 7, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Hours', inputType: 'number', inputLabel: 'Machine Hours', requiresPhoto: false },
    { number: 8, section: 'Job & Machine Information (Pre-Start)', title: 'Select Blade Type', inputType: 'select', inputLabel: 'Blade Type', options: ['PAT Blade', 'Semi-U', 'U Blade', 'Straight Blade', 'Other'], requiresPhoto: false },
    { number: 9, section: 'Job & Machine Information (Pre-Start)', title: 'Select Mount Type', inputType: 'select', inputLabel: 'Mount Type', options: ['Cab Mount', 'Blade Mount'], requiresPhoto: false },
    { number: 10, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full left side', requiresPhoto: true },
    { number: 11, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full right side', requiresPhoto: true },
    { number: 12, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine rear', requiresPhoto: true },
    { number: 13, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Cab interior', requiresPhoto: true },
    { number: 14, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Blade front view', requiresPhoto: true },

    // Section 2: Pre-Installation Verification
    { number: 15, section: 'Pre-Installation Verification', title: 'Machine parked on flat level surface', requiresPhoto: false },
    { number: 16, section: 'Pre-Installation Verification', title: 'Clear working area', requiresPhoto: false },
    { number: 17, section: 'Pre-Installation Verification', title: 'GNSS base station available (for 3D calibration)', requiresPhoto: false },
    { number: 18, section: 'Pre-Installation Verification', title: 'Clean 24V power available (7-36VDC verified)', requiresPhoto: false },
    { number: 19, section: 'Pre-Installation Verification', title: 'No structural cracks near intended antenna mounting', requiresPhoto: false },
    { number: 20, section: 'Pre-Installation Verification', title: 'Record Voltage Measured', inputType: 'number', inputLabel: 'Voltage Measured (V)', requiresPhoto: false },

    // Section 3: IronTwo Display Installation (Cab)
    { number: 21, section: 'IronTwo Display Installation (Cab)', title: 'Mounted inside cab', requiresPhoto: false },
    { number: 22, section: 'IronTwo Display Installation (Cab)', title: 'Does NOT obstruct operator view', requiresPhoto: false },
    { number: 23, section: 'IronTwo Display Installation (Cab)', title: 'Does NOT block exit', requiresPhoto: false },
    { number: 24, section: 'IronTwo Display Installation (Cab)', title: 'RAM mount secure', requiresPhoto: false },
    { number: 25, section: 'IronTwo Display Installation (Cab)', title: 'Adequate cable slack', requiresPhoto: false },
    { number: 26, section: 'IronTwo Display Installation (Cab)', title: 'Photo: IronTwo mounted', requiresPhoto: true },
    { number: 27, section: 'IronTwo Display Installation (Cab)', title: 'Photo: RAM mount close-up', requiresPhoto: true },
    { number: 28, section: 'IronTwo Display Installation (Cab)', title: 'Photo: Cable routing', requiresPhoto: true },
    { number: 29, section: 'IronTwo Display Installation (Cab)', title: 'Power connected to +VDC', requiresPhoto: false },
    { number: 30, section: 'IronTwo Display Installation (Cab)', title: 'Grounded to chassis (NOT battery negative)', requiresPhoto: false },
    { number: 31, section: 'IronTwo Display Installation (Cab)', title: 'Voltage verified at IronTwo', requiresPhoto: false },
    { number: 32, section: 'IronTwo Display Installation (Cab)', title: 'Enter IronTwo Serial Number', inputType: 'text', inputLabel: 'Serial Number (IronTwo)', requiresPhoto: false },

    // Section 4A: VR1000 GNSS - CAB MOUNT SYSTEM
    { number: 33, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Two antennas installed', requiresPhoto: false },
    { number: 34, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Mounted high and clear of exhaust stacks', requiresPhoto: false },
    { number: 35, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Equal height verified', requiresPhoto: false },
    { number: 36, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Maximum separation achieved', requiresPhoto: false },
    { number: 37, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Mounted symmetrically on cab', requiresPhoto: false },
    { number: 38, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Select Orientation', inputType: 'select', inputLabel: 'Orientation', options: ['Roll configuration (Left/Right)', 'Pitch configuration (Front/Rear)'], requiresPhoto: false },
    { number: 39, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Enter Antenna Separation', inputType: 'number', inputLabel: 'Antenna Separation (m)', requiresPhoto: false },
    { number: 40, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Photo: Both antennas top view', requiresPhoto: true },
    { number: 41, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Photo: Side profile', requiresPhoto: true },
    { number: 42, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Photo: Measurement of separation', requiresPhoto: true },
    { number: 43, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Photo: Coax routing entry', requiresPhoto: true },
    { number: 44, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Enter Primary Antenna Serial #', inputType: 'text', inputLabel: 'Primary Antenna Serial #', requiresPhoto: false },
    { number: 45, section: 'VR1000 GNSS - Cab Mount - Antenna Mounting', title: 'Enter Secondary Antenna Serial #', inputType: 'text', inputLabel: 'Secondary Antenna Serial #', requiresPhoto: false },

    // Section 4A2: VR1000 Receiver Mounting (Cab Mount)
    { number: 46, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Mounted inside cab / protected compartment', requiresPhoto: false },
    { number: 47, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Securely fastened (magnet or bracket)', requiresPhoto: false },
    { number: 48, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Away from heat sources', requiresPhoto: false },
    { number: 49, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Adequate ventilation', requiresPhoto: false },
    { number: 50, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Photo: Receiver mounted', requiresPhoto: true },
    { number: 51, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Photo: Cable connections', requiresPhoto: true },
    { number: 52, section: 'VR1000 GNSS - Cab Mount - Receiver', title: 'Enter VR1000 Serial #', inputType: 'text', inputLabel: 'VR1000 Serial #', requiresPhoto: false },

    // Section 4A3: Radio Antenna (Cab Mount)
    { number: 53, section: 'VR1000 GNSS - Cab Mount - Radio Antenna', title: 'Mounted highest possible point', requiresPhoto: false },
    { number: 54, section: 'VR1000 GNSS - Cab Mount - Radio Antenna', title: 'Clear 360° sky view', requiresPhoto: false },
    { number: 55, section: 'VR1000 GNSS - Cab Mount - Radio Antenna', title: 'Coax run neatly', requiresPhoto: false },
    { number: 56, section: 'VR1000 GNSS - Cab Mount - Radio Antenna', title: 'Glands or bulkhead used', requiresPhoto: false },
    { number: 57, section: 'VR1000 GNSS - Cab Mount - Radio Antenna', title: 'Photo: Radio antenna', requiresPhoto: true },

    // Section 4B: Blade Mount System
    { number: 58, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Mast bases welded securely', requiresPhoto: false },
    { number: 59, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Masts mounted securely', requiresPhoto: false },
    { number: 60, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Equal mast height verified', requiresPhoto: false },
    { number: 61, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Maximum practical separation achieved', requiresPhoto: false },
    { number: 62, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Enter Antenna Separation', inputType: 'number', inputLabel: 'Antenna Separation (m)', requiresPhoto: false },
    { number: 63, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Antennas aligned correctly', requiresPhoto: false },
    { number: 64, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'N-Type connectors facing same direction', requiresPhoto: false },
    { number: 65, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Photo: Mast welds', requiresPhoto: true },
    { number: 66, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Photo: Both antennas', requiresPhoto: true },
    { number: 67, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Photo: Separation measurement', requiresPhoto: true },
    { number: 68, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Photo: Reinforcement plate', requiresPhoto: true },
    { number: 69, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Enter Primary Antenna Serial #', inputType: 'text', inputLabel: 'Primary Antenna Serial #', requiresPhoto: false },
    { number: 70, section: 'VR1000 GNSS - Blade Mount - Antennas', title: 'Enter Secondary Antenna Serial #', inputType: 'text', inputLabel: 'Secondary Antenna Serial #', requiresPhoto: false },

    // Section 4B2: Cable Routing (Blade Mount)
    { number: 71, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Cables protected with braid/spiral/hose', requiresPhoto: false },
    { number: 72, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'No pinch points through articulation', requiresPhoto: false },
    { number: 73, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Full blade raise/lower tested', requiresPhoto: false },
    { number: 74, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Full tilt tested', requiresPhoto: false },
    { number: 75, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Full angle tested', requiresPhoto: false },
    { number: 76, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'No tension at full articulation', requiresPhoto: false },
    { number: 77, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Photo: Blade full raise', requiresPhoto: true },
    { number: 78, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Photo: Blade full lower', requiresPhoto: true },
    { number: 79, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Photo: Full tilt', requiresPhoto: true },
    { number: 80, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Photo: Full angle', requiresPhoto: true },
    { number: 81, section: 'VR1000 GNSS - Blade Mount - Cable Routing', title: 'Photo: Cable routing overview', requiresPhoto: true },

    // Section 4B3: Receiver Mounting (Blade Mount)
    { number: 82, section: 'VR1000 GNSS - Blade Mount - Receiver', title: 'Receiver mounted securely', requiresPhoto: false },
    { number: 83, section: 'VR1000 GNSS - Blade Mount - Receiver', title: 'Protected from vibration', requiresPhoto: false },
    { number: 84, section: 'VR1000 GNSS - Blade Mount - Receiver', title: 'Protected from moisture', requiresPhoto: false },
    { number: 85, section: 'VR1000 GNSS - Blade Mount - Receiver', title: 'Service loop provided', requiresPhoto: false },
    { number: 86, section: 'VR1000 GNSS - Blade Mount - Receiver', title: 'Enter VR1000 Serial #', inputType: 'text', inputLabel: 'VR1000 Serial #', requiresPhoto: false },

    // Section 5: Blade Sensor Installation (Dozer Specific)
    { number: 87, section: 'Blade Sensor Installation', title: 'Mount is welded centre and securely on the back of blade', requiresPhoto: false },
    { number: 88, section: 'Blade Sensor Installation', title: 'Bulkhead installed on dozer bonnet', requiresPhoto: false },
    { number: 89, section: 'Blade Sensor Installation', title: 'Coil cables all mounted securely and tied up', requiresPhoto: false },
    { number: 90, section: 'Blade Sensor Installation', title: 'Sensors mounted parallel to top of blade', requiresPhoto: false },
    { number: 91, section: 'Blade Sensor Installation', title: 'Weld quality inspected', requiresPhoto: false },
    { number: 92, section: 'Blade Sensor Installation', title: 'Orientation recorded', requiresPhoto: false },
    { number: 93, section: 'Blade Sensor Installation', title: 'Photo: Left sensor', requiresPhoto: true },
    { number: 94, section: 'Blade Sensor Installation', title: 'Photo: Right sensor', requiresPhoto: true },
    { number: 95, section: 'Blade Sensor Installation', title: 'Photo: Cable routing', requiresPhoto: true },
    { number: 96, section: 'Blade Sensor Installation', title: 'Photo: Orientation close-up', requiresPhoto: true },
    { number: 97, section: 'Blade Sensor Installation', title: 'Enter Blade Sensor Serial #', inputType: 'text', inputLabel: 'Blade Sensor #', requiresPhoto: false },

    // Chassis Sensor Installation (Dozer Specific)
    { number: 98, section: 'Chassis Sensor Installation', title: 'Mount is welded on a horizontal surface', requiresPhoto: false },
    { number: 99, section: 'Chassis Sensor Installation', title: 'Covers attached', requiresPhoto: false },
    { number: 100, section: 'Chassis Sensor Installation', title: 'Weld quality inspected', requiresPhoto: false },
    { number: 101, section: 'Chassis Sensor Installation', title: 'Orientation recorded', requiresPhoto: false },
    { number: 102, section: 'Chassis Sensor Installation', title: 'Photo: Left sensor', requiresPhoto: true },
    { number: 103, section: 'Chassis Sensor Installation', title: 'Photo: Right sensor', requiresPhoto: true },
    { number: 104, section: 'Chassis Sensor Installation', title: 'Photo: Cable routing', requiresPhoto: true },
    { number: 105, section: 'Chassis Sensor Installation', title: 'Photo: Orientation close-up', requiresPhoto: true },
    { number: 106, section: 'Chassis Sensor Installation', title: 'Enter Chassis Sensor Serial #', inputType: 'text', inputLabel: 'Chassis Sensor #', requiresPhoto: false },

    // Section 6: CAN Cable Routing
    { number: 107, section: 'CAN Cable Routing', title: 'All CAN cables connected in correct order', requiresPhoto: false },
    { number: 108, section: 'CAN Cable Routing', title: 'Neat and looks factory fitted', requiresPhoto: false },
    { number: 109, section: 'CAN Cable Routing', title: 'Cable protected (braid/spiral/hose)', requiresPhoto: false },
    { number: 110, section: 'CAN Cable Routing', title: 'No sharp edges', requiresPhoto: false },
    { number: 111, section: 'CAN Cable Routing', title: 'No pinch points', requiresPhoto: false },
    { number: 112, section: 'CAN Cable Routing', title: 'All connectors fully seated', requiresPhoto: false },
    { number: 113, section: 'CAN Cable Routing', title: 'Photo: Full machine cable routing overview', requiresPhoto: true },

    // Section 7: Software Configuration
    { number: 114, section: 'Software Configuration', title: 'Logged in as Administrator', requiresPhoto: false },
    { number: 115, section: 'Software Configuration', title: 'Machine profile created', requiresPhoto: false },
    { number: 116, section: 'Software Configuration', title: 'Cab mount or Blade mount selected correctly', requiresPhoto: false },
    { number: 117, section: 'Software Configuration', title: 'Correct blade type selected', requiresPhoto: false },
    { number: 118, section: 'Software Configuration', title: 'Sensor configuration correct', requiresPhoto: false },
    { number: 119, section: 'Software Configuration', title: 'TeamViewer installed and configured', requiresPhoto: false },
    { number: 120, section: 'Software Configuration', title: 'Localisation verified', requiresPhoto: false },
    { number: 121, section: 'Software Configuration', title: 'Photo: Equipment Setup screen', requiresPhoto: true },
    { number: 122, section: 'Software Configuration', title: 'Photo: Sensor configuration screen', requiresPhoto: true },
    { number: 123, section: 'Software Configuration', title: 'Photo: GNSS status screen', requiresPhoto: true },

    // Section 8: Sensor Calibration (2D)
    { number: 124, section: 'Sensor Calibration (2D)', title: 'Machine on flat level surface', requiresPhoto: false },
    { number: 125, section: 'Sensor Calibration (2D)', title: 'Left lift cylinder calibrated', requiresPhoto: false },
    { number: 126, section: 'Sensor Calibration (2D)', title: 'Right lift cylinder calibrated', requiresPhoto: false },
    { number: 127, section: 'Sensor Calibration (2D)', title: 'Cross slope calibrated', requiresPhoto: false },
    { number: 128, section: 'Sensor Calibration (2D)', title: 'Sensor values stable', requiresPhoto: false },
    { number: 129, section: 'Sensor Calibration (2D)', title: 'Enter Calibration Date', inputType: 'text', inputLabel: 'Calibration Date', requiresPhoto: false },
    { number: 130, section: 'Sensor Calibration (2D)', title: 'Photo: Sensor Info screen (all green checks)', requiresPhoto: true },
    { number: 131, section: 'Sensor Calibration (2D)', title: 'Photo: Calibration completion screen', requiresPhoto: true },

    // Section 9: 3D Calibration
    { number: 132, section: '3D Calibration', title: 'GNSS RTK Fixed', requiresPhoto: false },
    { number: 133, section: '3D Calibration', title: 'Base station configured', requiresPhoto: false },
    { number: 134, section: '3D Calibration', title: 'Antenna offsets entered', requiresPhoto: false },
    { number: 135, section: '3D Calibration', title: '3D calibration routine completed', requiresPhoto: false },
    { number: 136, section: '3D Calibration', title: 'Precision check performed', requiresPhoto: false },
    { number: 137, section: '3D Calibration', title: 'Enter Measured Point Error', inputType: 'text', inputLabel: 'Measured Point Error', requiresPhoto: false },
    { number: 138, section: '3D Calibration', title: 'Within tolerance?', inputType: 'select', inputLabel: 'Within Tolerance', options: ['Yes', 'No'], requiresPhoto: false },
    { number: 139, section: '3D Calibration', title: 'Photo: RTK Fixed screen', requiresPhoto: true },
    { number: 140, section: '3D Calibration', title: 'Photo: 3D calibration completion', requiresPhoto: true },
    { number: 141, section: '3D Calibration', title: 'Photo: Precision check results', requiresPhoto: true },

    // Section 10: Final Validation
    { number: 142, section: 'Final Validation', title: 'Cut/Fill responds correctly', requiresPhoto: false },
    { number: 143, section: 'Final Validation', title: 'Cross slope verified', requiresPhoto: false },
    { number: 144, section: 'Final Validation', title: 'Blade raise/lower verified', requiresPhoto: false },
    { number: 145, section: 'Final Validation', title: 'Blade tilt verified', requiresPhoto: false },
    { number: 146, section: 'Final Validation', title: 'Blade angle verified', requiresPhoto: false },
    { number: 147, section: 'Final Validation', title: 'No cable interference', requiresPhoto: false },
    { number: 148, section: 'Final Validation', title: 'All sensors reporting', requiresPhoto: false },
    { number: 149, section: 'Final Validation', title: 'GNSS heading reading "GNSS" (not COG)', requiresPhoto: false },
  ];

  await ChecklistTemplate.create({
    systemType: 'Hemisphere VR1000 Dozer',
    name: 'Hemisphere VR1000 Dozer',
    createdBy: admin._id,
    steps: hemisphereDozerSteps,
  });

  // ═══════════════════════════════════════════════════════
  // HEMISPHERE VR1000 EXCAVATOR - Comprehensive Checklist
  // ═══════════════════════════════════════════════════════
  const hemisphereExcavatorSteps = [
    // Section 1: Job & Machine Information (Pre-Start)
    { number: 1, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Installer Name', inputType: 'text', inputLabel: 'Installer Name', requiresPhoto: false },
    { number: 2, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Company', inputType: 'text', inputLabel: 'Company', requiresPhoto: false },
    { number: 3, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Customer Name', inputType: 'text', inputLabel: 'Customer Name', requiresPhoto: false },
    { number: 4, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Make', inputType: 'text', inputLabel: 'Machine Make', requiresPhoto: false },
    { number: 5, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Model', inputType: 'text', inputLabel: 'Machine Model', requiresPhoto: false },
    { number: 6, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Serial Number', inputType: 'text', inputLabel: 'Machine Serial Number', requiresPhoto: false },
    { number: 7, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Hours', inputType: 'number', inputLabel: 'Machine Hours', requiresPhoto: false },
    { number: 8, section: 'Job & Machine Information (Pre-Start)', title: 'Select Bucket Type', inputType: 'select', inputLabel: 'Bucket Type', options: ['Bucket 1', 'Bucket 2', 'Bucket 3', 'Bucket 4'], requiresPhoto: false },
    { number: 9, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full left side', requiresPhoto: true },
    { number: 10, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full right side', requiresPhoto: true },
    { number: 11, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine rear (counterweight)', requiresPhoto: true },
    { number: 12, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Cab interior', requiresPhoto: true },

    // Section 2: Pre-Installation Verification
    { number: 13, section: 'Pre-Installation Verification', title: 'Machine parked on flat level surface', requiresPhoto: false },
    { number: 14, section: 'Pre-Installation Verification', title: '360° safe rotation clearance', requiresPhoto: false },
    { number: 15, section: 'Pre-Installation Verification', title: 'Boom & stick fully extendable safely', requiresPhoto: false },
    { number: 16, section: 'Pre-Installation Verification', title: 'GNSS base station available (for 3D calibration)', requiresPhoto: false },
    { number: 17, section: 'Pre-Installation Verification', title: 'Clean 24V power available (7-36VDC verified)', requiresPhoto: false },
    { number: 18, section: 'Pre-Installation Verification', title: 'Record Voltage Measured', inputType: 'number', inputLabel: 'Voltage Measured (V)', requiresPhoto: false },

    // Section 3: IronTwo Display Installation
    { number: 19, section: 'IronTwo Display Installation', title: 'Mounted inside cab', requiresPhoto: false },
    { number: 20, section: 'IronTwo Display Installation', title: 'Does NOT obstruct operator view', requiresPhoto: false },
    { number: 21, section: 'IronTwo Display Installation', title: 'Does NOT block exit', requiresPhoto: false },
    { number: 22, section: 'IronTwo Display Installation', title: 'RAM mount secure', requiresPhoto: false },
    { number: 23, section: 'IronTwo Display Installation', title: 'Adequate cable slack for swivel', requiresPhoto: false },
    { number: 24, section: 'IronTwo Display Installation', title: 'Photo: IronTwo mounted', requiresPhoto: true },
    { number: 25, section: 'IronTwo Display Installation', title: 'Photo: RAM mount close-up', requiresPhoto: true },
    { number: 26, section: 'IronTwo Display Installation', title: 'Photo: Cable routing behind unit', requiresPhoto: true },
    { number: 27, section: 'IronTwo Display Installation', title: 'Power connected to +VDC', requiresPhoto: false },
    { number: 28, section: 'IronTwo Display Installation', title: 'Grounded to chassis (NOT battery negative)', requiresPhoto: false },
    { number: 29, section: 'IronTwo Display Installation', title: 'Voltage verified at IronTwo', requiresPhoto: false },
    { number: 30, section: 'IronTwo Display Installation', title: 'Enter IronTwo Serial Number', inputType: 'text', inputLabel: 'Serial Number (IronTwo)', requiresPhoto: false },

    // Section 4A: GMS-1 Body (Chassis) Sensor
    { number: 31, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Correct horizontal sensor used', requiresPhoto: false },
    { number: 32, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Mounted near machine centre', requiresPhoto: false },
    { number: 33, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Flat mounting surface', requiresPhoto: false },
    { number: 34, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Weld quality inspected', requiresPhoto: false },
    { number: 35, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Orientation recorded', requiresPhoto: false },
    { number: 36, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Photo: Weld plate', requiresPhoto: true },
    { number: 37, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Photo: Mounted sensor', requiresPhoto: true },
    { number: 38, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Photo: Orientation close-up', requiresPhoto: true },
    { number: 39, section: 'GMS-1 Sensor - Body (Chassis)', title: 'Enter Body Sensor Serial #', inputType: 'text', inputLabel: 'Body Sensor Serial #', requiresPhoto: false },

    // Section 4B: Boom Sensor
    { number: 40, section: 'GMS-1 Sensor - Boom', title: 'Vertical sensor used', requiresPhoto: false },
    { number: 41, section: 'GMS-1 Sensor - Boom', title: 'Mounted parallel to boom centreline', requiresPhoto: false },
    { number: 42, section: 'GMS-1 Sensor - Boom', title: 'Left side (preferred) / Right side', requiresPhoto: false },
    { number: 43, section: 'GMS-1 Sensor - Boom', title: 'Protected from hydraulic hose damage', requiresPhoto: false },
    { number: 44, section: 'GMS-1 Sensor - Boom', title: 'Weld quality inspected', requiresPhoto: false },
    { number: 45, section: 'GMS-1 Sensor - Boom', title: 'Photo: Mounting location', requiresPhoto: true },
    { number: 46, section: 'GMS-1 Sensor - Boom', title: 'Photo: Cable routing', requiresPhoto: true },
    { number: 47, section: 'GMS-1 Sensor - Boom', title: 'Photo: Sensor orientation', requiresPhoto: true },
    { number: 48, section: 'GMS-1 Sensor - Boom', title: 'Enter Boom Sensor Serial #', inputType: 'text', inputLabel: 'Boom Sensor Serial #', requiresPhoto: false },

    // Section 4C: Stick Sensor
    { number: 49, section: 'GMS-1 Sensor - Stick', title: 'Mounted near boom-to-stick pivot', requiresPhoto: false },
    { number: 50, section: 'GMS-1 Sensor - Stick', title: 'Visible to operator', requiresPhoto: false },
    { number: 51, section: 'GMS-1 Sensor - Stick', title: 'Cable routed along hydraulic lines', requiresPhoto: false },
    { number: 52, section: 'GMS-1 Sensor - Stick', title: 'Slack verified full motion', requiresPhoto: false },
    { number: 53, section: 'GMS-1 Sensor - Stick', title: 'Photo: Mount location', requiresPhoto: true },
    { number: 54, section: 'GMS-1 Sensor - Stick', title: 'Photo: Cable protection', requiresPhoto: true },
    { number: 55, section: 'GMS-1 Sensor - Stick', title: 'Photo: Full extend test', requiresPhoto: true },
    { number: 56, section: 'GMS-1 Sensor - Stick', title: 'Enter Stick Sensor Serial #', inputType: 'text', inputLabel: 'Stick Sensor Serial #', requiresPhoto: false },

    // Section 4D: Dog Bone Sensor
    { number: 57, section: 'GMS-1 Sensor - Dog Bone', title: 'Mounted first (recommended)', requiresPhoto: false },
    { number: 58, section: 'GMS-1 Sensor - Dog Bone', title: 'Clears bucket full open', requiresPhoto: false },
    { number: 59, section: 'GMS-1 Sensor - Dog Bone', title: 'Clears bucket full close', requiresPhoto: false },
    { number: 60, section: 'GMS-1 Sensor - Dog Bone', title: 'Cable slack correct', requiresPhoto: false },
    { number: 61, section: 'GMS-1 Sensor - Dog Bone', title: 'Terminator installed', requiresPhoto: false },
    { number: 62, section: 'GMS-1 Sensor - Dog Bone', title: 'Photo: Bucket open', requiresPhoto: true },
    { number: 63, section: 'GMS-1 Sensor - Dog Bone', title: 'Photo: Bucket closed', requiresPhoto: true },
    { number: 64, section: 'GMS-1 Sensor - Dog Bone', title: 'Photo: Clearance check', requiresPhoto: true },
    { number: 65, section: 'GMS-1 Sensor - Dog Bone', title: 'Photo: Sensor close-up', requiresPhoto: true },
    { number: 66, section: 'GMS-1 Sensor - Dog Bone', title: 'Enter Dog Bone Sensor Serial #', inputType: 'text', inputLabel: 'Dog Bone Sensor Serial #', requiresPhoto: false },

    // Section 4E: Tilt Bucket Sensor (if applicable)
    { number: 67, section: 'Tilt Bucket Sensor (if applicable)', title: 'Tilt bucket sensor installed', requiresPhoto: false },
    { number: 68, section: 'Tilt Bucket Sensor (if applicable)', title: 'Orientation verified', requiresPhoto: false },
    { number: 69, section: 'Tilt Bucket Sensor (if applicable)', title: 'Software configured', requiresPhoto: false },
    { number: 70, section: 'Tilt Bucket Sensor (if applicable)', title: 'Photo: Tilt bucket sensor', requiresPhoto: true },
    { number: 71, section: 'Tilt Bucket Sensor (if applicable)', title: 'Enter Tilt Sensor Serial #', inputType: 'text', inputLabel: 'Tilt Sensor Serial #', requiresPhoto: false },

    // Section 5: CAN Cable Routing
    { number: 72, section: 'CAN Cable Routing', title: 'All CAN cables connected in correct order', requiresPhoto: false },
    { number: 73, section: 'CAN Cable Routing', title: 'Neat and looks factory fitted', requiresPhoto: false },
    { number: 74, section: 'CAN Cable Routing', title: 'Cable protected (Braid/spiral wrap / hose / conduit)', requiresPhoto: false },
    { number: 75, section: 'CAN Cable Routing', title: 'No sharp edges', requiresPhoto: false },
    { number: 76, section: 'CAN Cable Routing', title: 'No pinch points', requiresPhoto: false },
    { number: 77, section: 'CAN Cable Routing', title: 'Photo: Full machine cable routing overview', requiresPhoto: true },

    // Section 6: GNSS Installation - VR500
    { number: 78, section: 'GNSS - VR500 Installation', title: 'Reach < 4m verified', requiresPhoto: false },
    { number: 79, section: 'GNSS - VR500 Installation', title: 'Arrow orientation recorded', inputType: 'select', inputLabel: 'Arrow Orientation', options: ['Pitch (forward)', 'Roll (right)'], requiresPhoto: false },
    { number: 80, section: 'GNSS - VR500 Installation', title: 'Mounted centreline', requiresPhoto: false },
    { number: 81, section: 'GNSS - VR500 Installation', title: 'Permanent weld / Magnet mount', requiresPhoto: false },
    { number: 82, section: 'GNSS - VR500 Installation', title: 'Location permanently marked', requiresPhoto: false },
    { number: 83, section: 'GNSS - VR500 Installation', title: 'Photo: Top view', requiresPhoto: true },
    { number: 84, section: 'GNSS - VR500 Installation', title: 'Photo: Side view', requiresPhoto: true },
    { number: 85, section: 'GNSS - VR500 Installation', title: 'Photo: Arrow direction close-up', requiresPhoto: true },
    { number: 86, section: 'GNSS - VR500 Installation', title: 'Enter VR500 Serial #', inputType: 'text', inputLabel: 'VR500 Serial #', requiresPhoto: false },

    // Section 6 OR: VR1000 Installation
    { number: 87, section: 'GNSS - VR1000 Installation', title: 'Two antennas installed', requiresPhoto: false },
    { number: 88, section: 'GNSS - VR1000 Installation', title: 'Mounted high and far apart', requiresPhoto: false },
    { number: 89, section: 'GNSS - VR1000 Installation', title: 'Select Orientation', inputType: 'select', inputLabel: 'Orientation', options: ['Roll config', 'Pitch config'], requiresPhoto: false },
    { number: 90, section: 'GNSS - VR1000 Installation', title: 'Enter Antenna Separation', inputType: 'number', inputLabel: 'Antenna Separation (m)', requiresPhoto: false },
    { number: 91, section: 'GNSS - VR1000 Installation', title: 'Antenna mounts secured correctly', requiresPhoto: false },
    { number: 92, section: 'GNSS - VR1000 Installation', title: 'Cables run through glands or bulkheads', requiresPhoto: false },
    { number: 93, section: 'GNSS - VR1000 Installation', title: 'Coax routed safely and neatly', requiresPhoto: false },
    { number: 94, section: 'GNSS - VR1000 Installation', title: 'Radio antenna mounted high and inline', requiresPhoto: false },
    { number: 95, section: 'GNSS - VR1000 Installation', title: 'Photo: Both antennas', requiresPhoto: true },
    { number: 96, section: 'GNSS - VR1000 Installation', title: 'Photo: Mast welds', requiresPhoto: true },
    { number: 97, section: 'GNSS - VR1000 Installation', title: 'Photo: Receiver mounting', requiresPhoto: true },
    { number: 98, section: 'GNSS - VR1000 Installation', title: 'Photo: Cable entry to cab', requiresPhoto: true },
    { number: 99, section: 'GNSS - VR1000 Installation', title: 'Enter VR1000 Serial #', inputType: 'text', inputLabel: 'VR1000 Serial #', requiresPhoto: false },
    { number: 100, section: 'GNSS - VR1000 Installation', title: 'Enter Primary Antenna Serial #', inputType: 'text', inputLabel: 'Primary Antenna Serial #', requiresPhoto: false },
    { number: 101, section: 'GNSS - VR1000 Installation', title: 'Enter Secondary Antenna Serial #', inputType: 'text', inputLabel: 'Secondary Antenna Serial #', requiresPhoto: false },

    // Section 7: Software Configuration
    { number: 102, section: 'Software Configuration', title: 'Logged in as Administrator', requiresPhoto: false },
    { number: 103, section: 'Software Configuration', title: 'Machine profile created', requiresPhoto: false },
    { number: 104, section: 'Software Configuration', title: 'Correct bucket type selected', requiresPhoto: false },
    { number: 105, section: 'Software Configuration', title: 'Correct sensor configuration', requiresPhoto: false },
    { number: 106, section: 'Software Configuration', title: 'TeamViewer installed and configured', requiresPhoto: false },
    { number: 107, section: 'Software Configuration', title: 'Localisation verified', requiresPhoto: false },
    { number: 108, section: 'Software Configuration', title: 'Photo: Equipment Setup screen', requiresPhoto: true },
    { number: 109, section: 'Software Configuration', title: 'Photo: Sensor configuration screen', requiresPhoto: true },

    // Section 8: Sensor Calibration (2D)
    { number: 110, section: 'Sensor Calibration (2D)', title: 'Machine on flat level surface', requiresPhoto: false },
    { number: 111, section: 'Sensor Calibration (2D)', title: 'Body sensor calibrated', requiresPhoto: false },
    { number: 112, section: 'Sensor Calibration (2D)', title: 'Boom sensor calibrated', requiresPhoto: false },
    { number: 113, section: 'Sensor Calibration (2D)', title: 'Stick sensor calibrated', requiresPhoto: false },
    { number: 114, section: 'Sensor Calibration (2D)', title: 'Dog bone calibrated', requiresPhoto: false },
    { number: 115, section: 'Sensor Calibration (2D)', title: 'Tilt bucket calibrated (if applicable)', requiresPhoto: false },
    { number: 116, section: 'Sensor Calibration (2D)', title: 'Enter Calibration Date', inputType: 'text', inputLabel: 'Calibration Date', requiresPhoto: false },
    { number: 117, section: 'Sensor Calibration (2D)', title: 'Photo: Sensor Info screen (all green checks)', requiresPhoto: true },
    { number: 118, section: 'Sensor Calibration (2D)', title: 'Photo: Calibration completion screen', requiresPhoto: true },

    // Section 9: 3D Calibration
    { number: 119, section: '3D Calibration', title: 'GNSS RTK Fixed', requiresPhoto: false },
    { number: 120, section: '3D Calibration', title: 'Base station configured', requiresPhoto: false },
    { number: 121, section: '3D Calibration', title: 'Antenna offsets entered', requiresPhoto: false },
    { number: 122, section: '3D Calibration', title: '3D calibration routine completed', requiresPhoto: false },
    { number: 123, section: '3D Calibration', title: 'Bucket tip check performed', requiresPhoto: false },
    { number: 124, section: '3D Calibration', title: 'Precision check performed', requiresPhoto: false },
    { number: 125, section: '3D Calibration', title: 'Enter Measured Point Error', inputType: 'text', inputLabel: 'Measured Point Error', requiresPhoto: false },
    { number: 126, section: '3D Calibration', title: 'Within tolerance?', inputType: 'select', inputLabel: 'Within Tolerance', options: ['Yes', 'No'], requiresPhoto: false },
    { number: 127, section: '3D Calibration', title: 'Photo: RTK Fixed status screen', requiresPhoto: true },
    { number: 128, section: '3D Calibration', title: 'Photo: 3D calibration completion', requiresPhoto: true },
    { number: 129, section: '3D Calibration', title: 'Photo: Precision check screens', requiresPhoto: true },

    // Section 10: Final Validation
    { number: 130, section: 'Final Validation', title: 'Cut/Fill responds correctly', requiresPhoto: false },
    { number: 131, section: 'Final Validation', title: 'Cross slope verified', requiresPhoto: false },
    { number: 132, section: 'Final Validation', title: 'Rotation 360° tested', requiresPhoto: false },
    { number: 133, section: 'Final Validation', title: 'Full boom range tested', requiresPhoto: false },
    { number: 134, section: 'Final Validation', title: 'No cable interference', requiresPhoto: false },
    { number: 135, section: 'Final Validation', title: 'All sensors reporting', requiresPhoto: false },
    { number: 136, section: 'Final Validation', title: 'No GNSS heading fallback (must read GNSS, not COG)', requiresPhoto: false },
  ];

  await ChecklistTemplate.create({
    systemType: 'Hemisphere VR1000 Excavator',
    name: 'Hemisphere VR1000 Excavator',
    createdBy: admin._id,
    steps: hemisphereExcavatorSteps,
  });

  // Placeholder templates for Stonex (to be filled in later)
  await ChecklistTemplate.create({
    systemType: 'Stonex STX-DIG Dozer',
    name: 'Stonex STX-DIG Dozer',
    createdBy: admin._id,
    steps: [
      { number: 1, section: 'Pre-Installation', title: 'Pre-Installation Safety Check', description: 'PPE check, machine isolation, site inspection', requiresPhoto: true },
      { number: 2, section: 'GNSS Installation', title: 'Install Stonex GNSS Receiver', description: 'Mount GNSS receiver on dozer, connect cables', requiresPhoto: true },
      { number: 3, section: 'Display Installation', title: 'Mount STX-DIG Display', description: 'Install display unit in cab, connect power and data', requiresPhoto: true },
      { number: 4, section: 'Sensor Installation', title: 'Install Blade Sensors', description: 'Mount blade rotation and slope sensors', requiresPhoto: true },
      { number: 5, section: 'Hydraulics', title: 'Connect Hydraulic Control Valves', description: 'Wire automatic blade control valves', requiresPhoto: true },
      { number: 6, section: 'Software Configuration', title: 'Configure Corrections Source', description: 'Set up NTRIP or local base station', requiresPhoto: false },
      { number: 7, section: 'Calibration', title: 'Calibrate Machine Profile', description: 'Input machine dimensions, calibrate sensors', requiresPhoto: false },
      { number: 8, section: 'Validation', title: 'System Test & Validation', description: 'Run diagnostics, verify accuracy', requiresPhoto: true },
      { number: 9, section: 'Sign-Off', title: 'Operator Training & Sign-Off', description: 'Train operator, complete documentation', requiresPhoto: true },
    ],
  });

  await ChecklistTemplate.create({
    systemType: 'Stonex STX-DIG Excavator',
    name: 'Stonex STX-DIG Excavator',
    createdBy: admin._id,
    steps: [
      { number: 1, section: 'Pre-Installation', title: 'Pre-Installation Safety Check', description: 'PPE check, machine isolation, site inspection', requiresPhoto: true },
      { number: 2, section: 'GNSS Installation', title: 'Install Stonex GNSS Receiver', description: 'Mount GNSS receiver on excavator cab/counterweight', requiresPhoto: true },
      { number: 3, section: 'Display Installation', title: 'Mount STX-DIG Display', description: 'Install display unit in cab', requiresPhoto: true },
      { number: 4, section: 'Sensor Installation', title: 'Install Boom Angle Sensor', description: 'Mount sensor on boom pin, route cable', requiresPhoto: true },
      { number: 5, section: 'Sensor Installation', title: 'Install Stick Angle Sensor', description: 'Mount sensor on stick pin, route cable', requiresPhoto: true },
      { number: 6, section: 'Sensor Installation', title: 'Install Bucket Tilt Sensor', description: 'Mount sensor on bucket linkage', requiresPhoto: true },
      { number: 7, section: 'Software Configuration', title: 'Configure Corrections Source', description: 'Set up NTRIP or local base station', requiresPhoto: false },
      { number: 8, section: 'Calibration', title: 'Calibrate Machine Geometry', description: 'Input boom/stick/bucket dimensions', requiresPhoto: false },
      { number: 9, section: 'Validation', title: 'System Test & Validation', description: 'Test dig guidance accuracy', requiresPhoto: true },
      { number: 10, section: 'Sign-Off', title: 'Operator Training & Sign-Off', description: 'Train operator, complete documentation', requiresPhoto: true },
    ],
  });

  console.log('Created 4 checklist templates (Hemisphere Dozer/Excavator comprehensive, Stonex placeholder)');

  // ── Create Sample Jobs ────────────────────────────────
  await Job.create({
    title: 'Hemisphere VR1000 Installation - Dozer',
    description: 'Install VR1000 machine guidance system on CAT D6 dozer with blade sensors',
    systemType: 'Hemisphere VR1000 Dozer',
    location: 'Denver, CO',
    address: '1234 Construction Way, Denver, CO 80201',
    scheduledDate: new Date('2026-03-20'),
    company: 'Rocky Mountain Earthworks',
    status: 'draft',
    createdBy: admin._id,
    assignedTo: mike._id,
    steps: [
      { number: 1, title: 'Pre-Installation Safety Check', description: 'Verify site safety', requiresPhoto: true, isCompleted: false },
      { number: 2, title: 'Mount GNSS Antenna on Dozer Blade', description: 'Install antenna mount', requiresPhoto: true, isCompleted: false },
      { number: 3, title: 'Install VR1000 Control Box in Cabin', description: 'Mount control box', requiresPhoto: true, isCompleted: false },
      { number: 4, title: 'Connect Blade Sensors', description: 'Install blade slope sensor', requiresPhoto: true, isCompleted: false },
      { number: 5, title: 'Configure Base Station Link', requiresPhoto: false, isCompleted: false },
      { number: 6, title: 'Calibrate Machine Geometry', requiresPhoto: false, isCompleted: false },
      { number: 7, title: 'Run System Diagnostics', requiresPhoto: true, isCompleted: false },
      { number: 8, title: 'Field Test & Operator Training', requiresPhoto: true, isCompleted: false },
      { number: 9, title: 'Final Sign-Off & Documentation', requiresPhoto: true, isCompleted: false },
    ],
  });

  await Job.create({
    title: 'Stonex STX-DIG Excavator Setup',
    description: 'Full Stonex STX-DIG installation on Komatsu PC200 excavator',
    systemType: 'Stonex STX-DIG Excavator',
    location: 'Phoenix, AZ',
    address: '567 Desert Road, Phoenix, AZ 85001',
    scheduledDate: new Date('2026-03-22'),
    company: 'Southwest Contracting',
    status: 'pending',
    createdBy: admin._id,
    assignedTo: tom._id,
    steps: [
      { number: 1, title: 'Pre-Installation Safety Check', requiresPhoto: true, isCompleted: false },
      { number: 2, title: 'Install Stonex GNSS Receiver', requiresPhoto: true, isCompleted: false },
      { number: 3, title: 'Mount STX-DIG Display', requiresPhoto: true, isCompleted: false },
      { number: 4, title: 'Install Boom Angle Sensor', requiresPhoto: true, isCompleted: false },
      { number: 5, title: 'Install Stick Angle Sensor', requiresPhoto: true, isCompleted: false },
      { number: 6, title: 'Install Bucket Tilt Sensor', requiresPhoto: true, isCompleted: false },
      { number: 7, title: 'Configure Corrections Source', requiresPhoto: false, isCompleted: false },
      { number: 8, title: 'Calibrate Machine Geometry', requiresPhoto: false, isCompleted: false },
      { number: 9, title: 'System Test & Validation', requiresPhoto: true, isCompleted: false },
      { number: 10, title: 'Operator Training & Sign-Off', requiresPhoto: true, isCompleted: false },
    ],
  });

  await Job.create({
    title: 'VR1000 Precision Installation',
    description: 'Full Hemisphere VR1000 Dozer setup including GPS antenna and calibration',
    systemType: 'Hemisphere VR1000 Dozer',
    location: 'Salt Lake City, UT',
    address: '890 Mountain View, Salt Lake City, UT 84101',
    scheduledDate: new Date('2026-03-25'),
    company: 'Wasatch Heavy Equipment',
    status: 'needs_approval',
    createdBy: admin._id,
    assignedTo: mike._id,
    steps: [
      { number: 1, title: 'Pre-Installation Safety Check', requiresPhoto: true, isCompleted: true },
      { number: 2, title: 'Mount GNSS Antenna', requiresPhoto: true, isCompleted: true },
      { number: 3, title: 'Install Control Box', requiresPhoto: true, isCompleted: true },
      { number: 4, title: 'Connect Blade Sensors', requiresPhoto: true, isCompleted: true },
      { number: 5, title: 'Configure Base Station', requiresPhoto: false, isCompleted: true },
      { number: 6, title: 'Calibrate Geometry', requiresPhoto: false, isCompleted: true },
      { number: 7, title: 'Run Diagnostics', requiresPhoto: true, isCompleted: true },
      { number: 8, title: 'Field Test', requiresPhoto: true, isCompleted: true },
      { number: 9, title: 'Final Sign-Off', requiresPhoto: true, isCompleted: true },
    ],
  });

  await Job.create({
    title: 'Stonex Dozer GPS Installation',
    description: 'Stonex STX-DIG installation on CAT D8 dozer',
    systemType: 'Stonex STX-DIG Dozer',
    location: 'Las Vegas, NV',
    address: '321 Strip Road, Las Vegas, NV 89101',
    scheduledDate: new Date('2026-03-28'),
    company: 'Nevada Grading Co',
    status: 'in_progress',
    createdBy: admin._id,
    assignedTo: lisa._id,
    steps: [
      { number: 1, title: 'Pre-Installation Safety Check', requiresPhoto: true, isCompleted: true },
      { number: 2, title: 'Install Stonex GNSS Receiver', requiresPhoto: true, isCompleted: true },
      { number: 3, title: 'Mount STX-DIG Display', requiresPhoto: true, isCompleted: true },
      { number: 4, title: 'Install Blade Sensors', requiresPhoto: true, isCompleted: false },
      { number: 5, title: 'Connect Hydraulic Control Valves', requiresPhoto: true, isCompleted: false },
      { number: 6, title: 'Configure Corrections Source', requiresPhoto: false, isCompleted: false },
      { number: 7, title: 'Calibrate Machine Profile', requiresPhoto: false, isCompleted: false },
      { number: 8, title: 'System Test & Validation', requiresPhoto: true, isCompleted: false },
      { number: 9, title: 'Operator Training & Sign-Off', requiresPhoto: true, isCompleted: false },
    ],
  });

  await Job.create({
    title: 'VR1000 Excavator Full Install',
    description: 'Hemisphere VR1000 excavator guidance on Hitachi ZX350',
    systemType: 'Hemisphere VR1000 Excavator',
    location: 'Portland, OR',
    address: '456 River Way, Portland, OR 97201',
    scheduledDate: new Date('2026-04-01'),
    company: 'Pacific Northwest Construction',
    status: 'completed',
    createdBy: admin._id,
    assignedTo: tom._id,
    completedAt: new Date('2026-03-15'),
    steps: [
      { number: 1, title: 'Pre-Installation Safety Check', requiresPhoto: true, isCompleted: true },
      { number: 2, title: 'Mount GNSS Antenna', requiresPhoto: true, isCompleted: true },
      { number: 3, title: 'Install Control Box', requiresPhoto: true, isCompleted: true },
      { number: 4, title: 'Install Boom & Stick Sensors', requiresPhoto: true, isCompleted: true },
      { number: 5, title: 'Install Bucket Sensor', requiresPhoto: true, isCompleted: true },
      { number: 6, title: 'Configure Base Station', requiresPhoto: false, isCompleted: true },
      { number: 7, title: 'Calibrate Machine Geometry', requiresPhoto: false, isCompleted: true },
      { number: 8, title: 'Run Diagnostics', requiresPhoto: true, isCompleted: true },
      { number: 9, title: 'Field Test', requiresPhoto: true, isCompleted: true },
      { number: 10, title: 'Final Sign-Off', requiresPhoto: true, isCompleted: true },
    ],
  });

  console.log('Created 5 sample jobs');
  console.log('\n=== SEED COMPLETE ===');
  console.log('Admin login: admin@rededge.com / password123');
  console.log('Installer logins:');
  console.log('  mike.johnson@rededge.com / password123');
  console.log('  tom.wilson@rededge.com / password123');
  console.log('  lisa.chen@rededge.com / password123');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
