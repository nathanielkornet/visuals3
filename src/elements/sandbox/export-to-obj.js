const fs = require('fs')
const path = require('path')
const exporter = new THREE.OBJExporter()
fs.writeFileSync(path.join(__dirname, './test.obj'), exporter.parse(mesh))
