const getClientes = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await req.db.query('SELECT * FROM cliente ORDER BY codc DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return res.status(200).json({
            status: 'success',
            data: result.rows,
            message: 'Clientes obtenidos',
            pagination: {
                currentpage: page,
                totalpage: Math.ceil(result.rows.length / limit),
                total: result.rows.length
            }
        });
    }catch (error) {
        console.error('Error al obtener clientes', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno'
        });
        next(error);
    }
}

const getClienteById = async (req, res, next) => {
    const { codc } = req.params;

    if (isNaN(codc)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'El ID proporcionado no es válido' });
    }

    try {
        const result = await req.db.query('SELECT * FROM cliente WHERE codc = $1', [codc]);

        if(result.rows.length === 0) {
            return res.status(404).json({
                status:'error',
                message: 'Cliente no encontrado o no existe',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: result.rows[0],
            message: 'Cliente encontrado'
        });
    } catch (error) {
        console.error(`Error al Obtener el cliente con id> ${codc}`, error);
        return next(error);
    }
}


const createCliente = async (req, res, next) => {
    const {codc, nombre, apellido, ciudad} = req.body;
    try {      
        const existing = await req.db.query('SELECT 1 FROM cliente WHERE codc = $1 ', [codc]);

        if(existing.rows.length > 0){
            return res.status(409).json({
                status: 'error',
                message: 'El código ya esta registrado en un cliente'
            });
        }

        const result = await req.db.query('INSERT INTO cliente (codc, nombre, apellido, ciudad) VALUES ($1,$2,$3,$4) RETURNING *', [codc, nombre, apellido, ciudad]);

        return res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error('Error al crear un cliente',error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno'
        });
        next(error);
    }
}

const updateCliente = async (req, res, next) => {
    const { codc } = req.params;
    const { nombre, apellido, ciudad } = req.body;

    if (isNaN(codc)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'El ID proporcionado no es válido' });
    }

    try {
        const existing = await req.db.query('SELECT 1 FROM cliente WHERE codc = $1', [codc]);

        if(existing.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Cliente no encontrado o no existe'
            });
        }

        const result = await req.db.query(
            'UPDATE cliente SET nombre = $1, apellido = $2, ciudad = $3 WHERE codc = $4 RETURNING *',
            [nombre, apellido, ciudad, codc]
        );

        return res.status(200).json({
            status: 'success',
            data: result.rows[0],
            message: 'Cliente actualizado correctamente'
        });
    } catch (error) {
        console.error(`Error al actualizar el cliente con id> ${codc}`, error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno'
        });
        next(error);
    }
}

const deleteCliente = async (req, res, next) => {
    const { codc } = req.params;
    
    if (isNaN(codc)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'El ID proporcionado no es válido' });
    }

    try {
        const existing = await req.db.query('SELECT 1 FROM cliente WHERE codc = $1', [codc]);

        if(existing.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Cliente no encontrado o no existe'
            });
        }

        const result = await req.db.query('DELETE FROM cliente WHERE codc = $1 RETURNING *', [codc]);

        return res.status(200).json({
            status: 'success',
            data: result.rows[0],
            message: 'Cliente eliminado correctamente'
        });
    }catch (error) {
        console.error(`Error al eliminar el cliente con id> ${codc}`, error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno'
        });
         next(error);
    }
}

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
}