// import { uploadFile } from './config/storage.config';
// import * as fs from 'fs';
// import * as path from 'path';

// const testFileUpload = async () => {
//     try {
//         // Crear archivo de prueba
//         const testFilePath = path.join(__dirname, 'test-file.txt');
//         fs.writeFileSync(testFilePath, 'Esto es una prueba de carga');

//         // Preparar archivo para upload
//         const testFile: Express.Multer.File = {
//             fieldname: 'file',
//             originalname: 'test-file.txt',
//             encoding: '7bit',
//             mimetype: 'text/plain',
//             buffer: fs.readFileSync(testFilePath),
//             size: fs.statSync(testFilePath).size,
//             destination: '',
//             filename: 'test-file.txt',
//             path: testFilePath,
//             stream: fs.createReadStream(testFilePath)
//         };

//         // Subir archivo
//         const publicUrl = await uploadFile(testFile);
//         console.log('✅ Archivo subido exitosamente');
//         console.log('URL pública:', publicUrl);

//         // Limpiar archivo de prueba
//         fs.unlinkSync(testFilePath);

//     } catch (error) {
//         console.error('❌ Error al subir archivo:', error);
//         process.exit(1);
//     }
// };

// testFileUpload();