import express from 'express';
import xlsx from 'xlsx';
import path from 'path';
import conectWatsapp from './controllers/conectWatsapp.js';
import conectDB from './db/config.js'


const app = express()

const PORT = 3000;

// Ruta que recibe un nombre de autoparte por query y la busca
// app.get('/buscar-parte', (req, res) => {
//     console.log("entroooooooo")
//     console.log(req.body)
//   const parteBuscada = req.query.nombre;
//   if (!parteBuscada) return res.status(400).json({ error: "Falta el parámetro 'nombre'" });

//   // Cargar el archivo Excel (debe estar en la raíz del proyecto o especificar ruta)
// //   const workbook = xlsx.readFile('/xls/autopartes_en_venta.xlsx');
// const workbook = xlsx.readFile(path.join(__dirname, 'xls', 'autopartes_en_venta.xlsx'));
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = xlsx.utils.sheet_to_json(sheet);

//   // Buscar coincidencias por nombre (insensible a mayúsculas)
//   const resultado = data.filter(p =>
//     p.Nombre.toLowerCase().includes(parteBuscada.toLowerCase())
//   );

//   if (resultado.length === 0) {
//     return res.json({ disponible: false, mensaje: "Parte no encontrada" });
//   }

//   return res.json({ disponible: true, coincidencias: resultado });
// });

const startServer = () => {
  try {
    conectDB()
    conectWatsapp()

    app.listen(PORT, () => {
   console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
    
  } catch (error) {
    console.log("Error al Iniciar El Servidor...!!! :(")
  }
} 

startServer()


