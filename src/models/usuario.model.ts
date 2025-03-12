import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config';
import bcrypt from 'bcrypt';

type TipoUsuario = 'usuario' | 'administrador';

interface UsuarioAttributes {
    id?: number;
    nombre: string;
    apellido: string;
    tipo_usuario: TipoUsuario;
    contrasena: string;
}

/**
 * Represents a user in the system.
 * 
 * @extends Model<UsuarioAttributes>
 * @implements UsuarioAttributes
 */
export class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
    /**
     * The unique identifier for the user.
     */
    public id!: number;

    /**
     * The first name of the user.
     */
    public nombre!: string;

    /**
     * The last name of the user.
     */
    public apellido!: string;

    /**
     * The type of user.
     */
    public tipo_usuario!: TipoUsuario;

    /**
     * The password of the user.
     */
    public contrasena!: string;

    /**
     * The date and time when the user was created.
     * This field is automatically managed by the database.
     */
    public readonly createdAt!: Date;

    /**
     * The date and time when the user was last updated.
     * This field is automatically managed by the database.
     */
    public readonly updatedAt!: Date;

    /**
     * Compares the provided password with the user's stored password.
     * 
     * @param contrasena - The password to compare.
     * @returns A promise that resolves to `true` if the passwords match, or `false` otherwise.
     */
    async validarContrasena(contrasena: string): Promise<boolean> {
        return bcrypt.compare(contrasena, this.contrasena);
    }
}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tipo_usuario: {
        type: DataTypes.ENUM('usuario', 'administrador'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 100]
        }
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (usuario: Usuario) => {
            const salt = await bcrypt.genSalt(10);
            usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        },
        beforeUpdate: async (usuario: Usuario) => {
            if (usuario.changed('contrasena')) {
                const salt = await bcrypt.genSalt(10);
                usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
            }
        }
    }
});

export default Usuario;