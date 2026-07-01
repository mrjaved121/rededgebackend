// Shared checklist step definitions for machines added outside the main seed cycle.
// Used by both seed.js (full reseed) and pushNewMachines.js (additive push to a live DB).

// DOZER BLADE MOUNT - from client sheet Hemisphere_VR1000_Dozer_BladeMount.xlsx
const dozerBladeMountSteps = [
  // Section 1: Job & Machine Information (Pre-Start)
  { number: 1, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Installer Name', inputType: 'text', inputLabel: 'Installer Name', requiresPhoto: false },
  { number: 2, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Company', inputType: 'text', inputLabel: 'Company', requiresPhoto: false },
  { number: 3, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Customer Name', inputType: 'text', inputLabel: 'Customer Name', requiresPhoto: false },
  { number: 4, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Make', inputType: 'text', inputLabel: 'Machine Make', requiresPhoto: false },
  { number: 5, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Model', inputType: 'text', inputLabel: 'Machine Model', requiresPhoto: false },
  { number: 6, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Serial Number', inputType: 'text', inputLabel: 'Machine Serial Number', requiresPhoto: false },
  { number: 7, section: 'Job & Machine Information (Pre-Start)', title: 'Select Mount Type', inputType: 'select', inputLabel: 'Mount Type', options: ['Cab Mount', 'Blade Mount'], requiresPhoto: false },
  { number: 8, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full left side', requiresPhoto: true },
  { number: 9, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine full right side', requiresPhoto: true },
  { number: 10, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Machine rear', requiresPhoto: true },
  { number: 11, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Cab interior', requiresPhoto: true },
  { number: 12, section: 'Job & Machine Information (Pre-Start)', title: 'Photo: Blade front view', requiresPhoto: true },

  // Section 2: Pre-Installation Verification
  { number: 13, section: 'Pre-Installation Verification', title: 'Clear working area', requiresPhoto: false },
  { number: 14, section: 'Pre-Installation Verification', title: 'GNSS base station available (for 3D calibration)', requiresPhoto: false },
  { number: 15, section: 'Pre-Installation Verification', title: 'Clean 24V power available (7-36VDC verified)', requiresPhoto: false },

  // Section 3: IronTwo / Receiver / Antenna / Sensor Info (Cab)
  { number: 16, section: 'IronTwo Display Information (Cab)', title: 'Enter IronTwo Serial Number', inputType: 'text', inputLabel: 'IronTwo Serial Number', requiresPhoto: false },
  { number: 17, section: 'Receiver Information (Cab)', title: 'Enter VR1000 Serial Number', inputType: 'text', inputLabel: 'VR1000 Serial Number', requiresPhoto: false },
  { number: 18, section: 'Antenna Information (Cab)', title: 'Enter Antenna Serial Numbers', description: '1. Primary  2. Secondary', inputType: 'text', inputLabel: 'Antenna Serial Numbers', requiresPhoto: false },
  { number: 19, section: 'Sensor Information (Cab)', title: 'Enter Sensor Serial Numbers', description: '1. Chassis  2. Blade', inputType: 'text', inputLabel: 'Sensor Serial Numbers', requiresPhoto: false },

  // Section 4: Apollo 10 Display Installation (Cab)
  { number: 20, section: 'Apollo 10 Display Installation (Cab)', title: 'Apollo 10 Display Mounted inside cab', description: '1. Does not obstruct operator view  2. Does NOT block exit  3. Adequate cable slack', requiresPhoto: false },
  { number: 21, section: 'Apollo 10 Display Installation (Cab)', title: 'Photo: Apollo 10 mounted', requiresPhoto: true },
  { number: 22, section: 'Apollo 10 Display Installation (Cab)', title: 'Photo: Cable routing', requiresPhoto: true },
  { number: 23, section: 'Apollo 10 Display Installation (Cab)', title: 'Power connected to +VDC', requiresPhoto: false },
  { number: 24, section: 'Apollo 10 Display Installation (Cab)', title: 'Grounded to chassis (NOT battery negative)', requiresPhoto: false },

  // Section 5A: SMC 1/2 GNSS - Blade Mount
  { number: 25, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Take Pictures of the 2 welded Blade Pole Mounts', requiresPhoto: true },
  { number: 26, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Take Pictures of the 2 welded Blade Poles', requiresPhoto: true },
  { number: 27, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Two antennas installed', description: 'Primary Antenna on left Pole, Secondary on Right Pole', requiresPhoto: false },
  { number: 28, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Photo: Both antennas top view', requiresPhoto: true },
  { number: 29, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Photo: Side profile', requiresPhoto: true },
  { number: 30, section: 'SMC 1/2 GNSS - Blade Mount - Antenna Mounting', title: 'Photo: GPS Cable routing entry', requiresPhoto: true },

  // Section 5B: SMC 1/2 GNSS - Cab Mount
  { number: 31, section: 'SMC 1/2 GNSS - Cab Mount - Receiver', title: 'Mounted inside cab / protected compartment', description: '1. Away from heat sources  2. Adequate ventilation', requiresPhoto: false },
  { number: 32, section: 'SMC 1/2 GNSS - Cab Mount - Receiver', title: 'Photo: Receiver mounted', requiresPhoto: true },
  { number: 33, section: 'SMC 1/2 GNSS - Cab Mount - Receiver', title: 'Photo: Cable connections', requiresPhoto: true },
  { number: 34, section: 'SMC 1/2 GNSS - Cab Mount - Radio Antenna', title: 'Mounted highest possible point', requiresPhoto: false },
  { number: 35, section: 'SMC 1/2 GNSS - Cab Mount - Radio Antenna', title: 'Coax run neatly', requiresPhoto: false },
  { number: 36, section: 'SMC 1/2 GNSS - Cab Mount - Radio Antenna', title: 'Photo: Radio antenna', requiresPhoto: true },

  // Section 6: Blade Sensor Installation
  { number: 37, section: 'Blade Sensor Installation', title: 'Mount is welded centre and securely on the back of blade', requiresPhoto: true },
  { number: 38, section: 'Blade Sensor Installation', title: 'Bulkhead installed on dozer bonnet', requiresPhoto: true },
  { number: 39, section: 'Blade Sensor Installation', title: 'Coil cables all mounted securely and tied up', requiresPhoto: true },
  { number: 40, section: 'Blade Sensor Installation', title: 'Photo: Front sensor', requiresPhoto: true },
  { number: 41, section: 'Blade Sensor Installation', title: 'Covers attached', requiresPhoto: false },
  { number: 42, section: 'Blade Sensor Installation', title: 'Photo: Cable routing', requiresPhoto: true },

  // Section 7: Chassis Sensor Installation
  { number: 43, section: 'Chassis Sensor Installation', title: 'Mount is welded on a horizontal surface', requiresPhoto: false },
  { number: 44, section: 'Chassis Sensor Installation', title: 'Covers attached', requiresPhoto: false },
  { number: 45, section: 'Chassis Sensor Installation', title: 'Weld quality inspected', requiresPhoto: false },
  { number: 46, section: 'Chassis Sensor Installation', title: 'Photo: Front sensor', requiresPhoto: true },
  { number: 47, section: 'Chassis Sensor Installation', title: 'Photo: Cable routing', requiresPhoto: true },
  { number: 48, section: 'Chassis Sensor Installation', title: 'Enter Chassis Sensor Serial #', inputType: 'text', inputLabel: 'Chassis Sensor #', requiresPhoto: false },

  // Section 8: CAN Cable Routing
  { number: 49, section: 'CAN Cable Routing', title: 'All CAN cables connected in correct order', requiresPhoto: false },
  { number: 50, section: 'CAN Cable Routing', title: 'Neat and looks factory fitted', requiresPhoto: false },
  { number: 51, section: 'CAN Cable Routing', title: 'Cable protected (braid/spiral/hose)', requiresPhoto: false },
  { number: 52, section: 'CAN Cable Routing', title: 'No sharp edges', requiresPhoto: false },
  { number: 53, section: 'CAN Cable Routing', title: 'No pinch points', requiresPhoto: false },
  { number: 54, section: 'CAN Cable Routing', title: 'All connectors fully seated', requiresPhoto: false },

  // Section 9: Software Configuration
  { number: 55, section: 'Software Configuration', title: 'Logged in as Administrator', requiresPhoto: false },
  { number: 56, section: 'Software Configuration', title: 'Machine profile created', description: 'When profile is created, use Plant ID and machine brand, e.g. Hitachi EX242', requiresPhoto: false },
  { number: 57, section: 'Software Configuration', title: 'Cab mount selected', requiresPhoto: false },
  { number: 58, section: 'Software Configuration', title: 'Sensor configuration correct', description: 'Set Label and LED direction', requiresPhoto: false },
  { number: 59, section: 'Software Configuration', title: 'TeamViewer installed and configured', description: 'Install and login to TeamViewer and set Red Edge as host', requiresPhoto: false },
  { number: 60, section: 'Software Configuration', title: 'Photo: Equipment Setup screen', description: 'Take a picture once all measurements have been input', requiresPhoto: true },

  // Section 10: Sensor Calibration (2D)
  { number: 61, section: 'Sensor Calibration (2D)', title: 'Machine Measureup Complete', description: 'Complete the full measureup: Antenna - Chassis - Blade', requiresPhoto: true },
  { number: 62, section: 'Sensor Calibration (2D)', title: 'Sensor Quick Cal', description: 'Complete the Sensor Quick Cal by inputting the digital level of the sensors', requiresPhoto: false },

  // Section 11: 3D Calibration
  { number: 63, section: '3D Calibration', title: 'Base station setup', description: 'Base station is set up and details are copied into the machine', requiresPhoto: false },
  { number: 64, section: '3D Calibration', title: 'GNSS RTK Fixed', description: 'Does the machine have a fix? If so take a picture', requiresPhoto: true },
  { number: 65, section: '3D Calibration', title: 'Precision check performed', description: 'Once the machine and base are connected and picking up enough sats, perform a precision check', requiresPhoto: false },
  { number: 66, section: '3D Calibration', title: 'Within tolerance?', description: 'Is the precision check within tolerance? D10/D11 20mm, D9> 15mm', inputType: 'select', inputLabel: 'Within Tolerance', options: ['Yes', 'No'], requiresPhoto: true },
  { number: 67, section: '3D Calibration', title: 'Photo: Precision check results', requiresPhoto: true },

  // Section 12: Final Validation
  { number: 68, section: 'Final Validation', title: 'Blade raise/lower verified', requiresPhoto: false },
  { number: 69, section: 'Final Validation', title: 'Blade tilt verified', requiresPhoto: false },
  { number: 70, section: 'Final Validation', title: 'All sensors reporting', description: 'Take a picture of the Sensor Info page', requiresPhoto: true },
];

// DRILL RIG / PILING MACHINE - placeholder, client will adjust once their sheet is ready
const drillRigPilingSteps = [
  { number: 1, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Installer Name', inputType: 'text', inputLabel: 'Installer Name', requiresPhoto: false },
  { number: 2, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Make/Model', inputType: 'text', inputLabel: 'Machine Make/Model', requiresPhoto: false },
  { number: 3, section: 'Job & Machine Information (Pre-Start)', title: 'Enter Machine Serial Number', inputType: 'text', inputLabel: 'Machine Serial Number', requiresPhoto: false },
  { number: 4, section: 'Pre-Installation', title: 'Pre-Installation Safety Check', description: 'PPE check, machine isolation, site inspection', requiresPhoto: true },
  { number: 5, section: 'Sign-Off', title: 'Placeholder - checklist to be finalised by client', description: 'Steps will be added once the client provides the full check sheet', requiresPhoto: false },
];

module.exports = { dozerBladeMountSteps, drillRigPilingSteps };
