// import { storage, bucket } from './config/storage.config';

// const testStorageConnection = async () => {
//     try {
//         // Prueba la conexión listando los buckets
//         const [buckets] = await storage.getBuckets();
//         console.log('✅ Conexión a Google Cloud Storage exitosa');
//         console.log('Buckets disponibles:', buckets.map(bucket => bucket.name));

//         // Prueba el bucket específico
//         const [exists] = await bucket.exists();
//         if (exists) {
//             console.log(`✅ Bucket "${process.env.GOOGLE_BUCKET_NAME}" encontrado`);
//         } else {
//             console.log(`❌ Bucket "${process.env.GOOGLE_BUCKET_NAME}" no encontrado`);
//         }
//     } catch (error) {
//         console.error('❌ Error al conectar con Google Cloud Storage:', error);
//         process.exit(1);
//     }
// };

// testStorageConnection();