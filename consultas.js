const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const pool = new Pool({
    host: 'dpg-ckfjtm6afg7c738j6h00-a',
    user: 'eneivel',
    password: 'EYXZscLJF6b4YtuobS3yU1ttyl7C7hP8',
    database: 'serverdb_np18',
    port: 5432,
    allowExitOnIdle: true
})

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguage]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    try {
        await pool.query(consulta, values)
    } catch (error) {
        console.log(error);
    }
    
}


const obtenerDatosDeUsuario = async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"

    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount) {
        throw { code: 404, message: "No se encontró ningún usuario con este email" }
    }

    delete usuario.password
    return usuario
}

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"

    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    console.log(usuario);
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}


module.exports = { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario }