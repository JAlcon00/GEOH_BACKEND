import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config';
import Inmueble from './inmueble.model';

interface ClienteAttributes {
    id: number;
    tipoPersona: 'fisica' | 'moral';
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    representanteLegal?: string;
    rfc?: string;
    fechaNacimiento?: Date;
    fechaConstitucion?: Date;
    correo?: string;
    telefono?: string;
    domicilio?: string;
    ciudad?: string;
    estado?: string;
    pais?: string;
}

/**
 * Represents a client (Cliente) in the system.
 * 
 * @extends Model<ClienteAttributes>
 * @implements ClienteAttributes
 */
export class Cliente extends Model<ClienteAttributes> implements ClienteAttributes {
    public id!: number;
    public tipoPersona!: 'fisica' | 'moral';
    public nombre?: string;
    public apellidoPaterno?: string;
    public apellidoMaterno?: string;
    public razonSocial?: string;
    public representanteLegal?: string;
    public rfc?: string;
    public fechaNacimiento?: Date;
    public fechaConstitucion?: Date;
    public correo?: string;
    public telefono?: string;
    public domicilio?: string;
    public ciudad?: string;
    public estado?: string;
    public pais?: string;
}

Cliente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipoPersona: {
        type: DataTypes.ENUM('fisica', 'moral'),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    apellidoPaterno: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    apellidoMaterno: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    razonSocial: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    representanteLegal: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    rfc: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaConstitucion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    domicilio: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'cliente',
    timestamps: true
});



// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('✅ Tabla "Cliente" sincronizada correctamente.');
  })
  .catch((error: any) => {
    console.error('❌ Error al sincronizar la tabla "Cliente":', error);
  });

export default Cliente;