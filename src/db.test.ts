import { sequelize } from './config/db.config';
import { QueryTypes } from 'sequelize';

const checkTablesExist = async () => {
    try {
        console.log('🗄 Verificando tablas en la base de datos...');

        const tables = ['documento', 'Clientes', 'Inmuebles', 'usuario'];
        for (const table of tables) {
            const result = await sequelize.query(
                `SHOW TABLES LIKE '${table}'`,
                { type: QueryTypes.SHOWTABLES }
            );

            if (result.length > 0) {
                console.log(`✅ Tabla "${table}" encontrada`);
            } else {
                console.log(`❌ Tabla "${table}" no encontrada`);
            }
        }
    } catch (error) {
        console.error('❌ Error al verificar tablas:', error);
    } finally {
        // Cerrar conexión a base de datos
        await sequelize.close();
        console.log('🔌 Conexión a base de datos cerrada');
    }
};

checkTablesExist();