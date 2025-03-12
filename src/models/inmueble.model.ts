import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config';
import Cliente from './cliente.model';

/**
 * Represents a real estate property.
 * 
 * @extends Model
 */
class Inmueble extends Model {
    /**
     * The unique identifier for the property.
     */
    public id!: number;

    /**
     * The identifier of the client who owns the property.
     */
    public clienteId!: number;

    /**
     * The address of the property.
     */
    public direccion!: string;

    /**
     * The market value of the property.
     */
    public valorMercado!: number;

    /**
     * The geographical location of the property.
     * 
     * @property {string} type - The type of the geographical data (e.g., "Point").
     * @property {[number, number]} coordinates - The coordinates of the property [longitude, latitude].
     */
    public ubicacionGeografica!: { type: string, coordinates: [number, number] };

    /**
     * The photo of the property.
     */
    public foto!: string;
}

Inmueble.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cliente', // Nombre de la tabla referenciada
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    valorMercado: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true
    },
    ubicacionGeografica: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true
    },
    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Inmueble',
    tableName: 'inmueble',
    timestamps: true
});

Inmueble.belongsTo(Cliente, { foreignKey: 'clienteId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Cliente.hasMany(Inmueble, { foreignKey: 'clienteId' });

sequelize.sync()
  .then(() => {
    console.log('✅ Tabla "Inmueble" sincronizada correctamente.');
  })
  .catch((error: any) => {
    console.error('❌ Error al sincronizar la tabla "Inmuebles":', error);
  });


export default Inmueble;