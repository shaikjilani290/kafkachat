// Bring in the room class
const Namespace =  require('../helpers/Namespace');
const Room =  require('../helpers/Room');

// Set up the namespaces
let namespaces = [];
let fs = new Namespace(0,'FS','https://aajcoders.com/namespace1.png','/fs');
let architects = new Namespace(1,'Architects','https://aajcoders.com/languages.png','/arch');
let pm = new Namespace(2,'Project Manager','https://t4.ftcdn.net/jpg/03/12/63/07/240_F_312630787_LVLUEv07hTZxtu6fvOdRhsL2XAfzpVa1.jpg','/pm');


// Make the main room and add it to rooms. it will ALWAYS be 0
fs.addRoom(new Room(0,'General','FS'));
fs.addRoom(new Room(1,'Team Building','FS'));
fs.addRoom(new Room(2,'Onboarding','FS'));

architects.addRoom(new Room(0,'General','Architects'));
architects.addRoom(new Room(1,'Web Application','Architects'));
architects.addRoom(new Room(2,'Mobile Native','Architects'));
architects.addRoom(new Room(3,'Mobile Hybrid','Architects'));
architects.addRoom(new Room(4,'Resources','Architects'));

pm.addRoom(new Room(0,'General','Project Manager'));
pm.addRoom(new Room(1,'Staffing discussion','Project Manager'));
pm.addRoom(new Room(2,'Resources','Project Manager'));

namespaces.push(fs,architects,pm);

module.exports = namespaces;