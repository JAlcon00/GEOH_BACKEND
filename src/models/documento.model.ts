import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config';
import Inmueble from './inmueble.model';

export enum TipoDocumento {
    ESCRITURA = 'escritura',
    LIBERTAD_GRAVAMEN = 'libertad_gravamen',
    AVALUO = 'avaluo',
    FOTOGRAFIA = 'fotografia'
}

export enum Estatus {
    RECHAZADO = 'rechazado',
    PENDIENTE = 'pendiente',
    ACEPTADO = 'aceptado'
}

export interface DocumentoAttributes {
    id?: number;
    inmuebleId?: number;
    tipoDocumento?: TipoDocumento;
    archivoUrl?: string;
    estatus?: Estatus;
}

/**
 * Represents a Documento model.
 * 
 * @extends Model<DocumentoAttributes>
 * @implements DocumentoAttributes
 */
export class Documento extends Model<DocumentoAttributes> implements DocumentoAttributes {
    public id!: number;
    public inmuebleId?: number;
    public tipoDocumento!: TipoDocumento;
    public archivoUrl?: string;
    public estatus!: Estatus;
    
}

Documento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    inmuebleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Inmueble,
            key: 'id'
        }
    },
    tipoDocumento: {
        type: DataTypes.ENUM('escritura', 'libertad_gravamen', 'avaluo', 'fotografia'),
        allowNull: false,
        validate: {
            isIn: [['escritura', 'libertad_gravamen', 'avaluo', 'fotografia']]
        }
    },
    archivoUrl: {
        type: DataTypes.STRING(2048), // Aumenta la longitud máxima de la URL
        allowNull: true,
        // validate: {
        //     isUrl: true
        // }
    },
    estatus: {
        type: DataTypes.ENUM('rechazado', 'pendiente', 'aceptado'),
        allowNull: false,
        defaultValue: 'pendiente',
    },

}, {
    sequelize,
    modelName: 'Documento',
    tableName: 'documento', 
    timestamps: false, // No incluir createdAt y updatedAt
    hooks: {
        beforeValidate: (documento: Documento) => {
            if (documento.archivoUrl && !documento.archivoUrl.startsWith('http')) {
                documento.archivoUrl = `https://storage.googleapis.com/${process.env.GOOGLE_BUCKET_NAME}/${documento.archivoUrl}`;
            }
        }
    }

    
});

// Establecer relación
Documento.belongsTo(Inmueble, {
    foreignKey: 'inmuebleId',
    onDelete: 'SET NULL'
});
Inmueble.hasMany(Documento, {
    foreignKey: 'inmuebleId'
});

sequelize.sync()
  .then(() => {
    console.log('✅ Tabla "Documento" sincronizada correctamente.');
  })
  .catch((error: any) => {
    console.error('❌ Error al sincronizar la tabla "Documento":', error);
  });

export default Documento;