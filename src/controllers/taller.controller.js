const tallerService = require('../services/taller.services');


const getAllTalleres = async (req, res, next) => {
    try {
        const response = await tallerService.AllTalleres(req.db);
        res.status(200).json({
            status: 'success',
            data: response.rows,
            message: 'Talleres obtenidos exitosamente'
        })
    } catch (error) {
        console.error('Error al obtener los talleres:', error);
        res.status(500).json({message: 'error al obtener los talleres', status: 'error'});
        next(error);
    }
}

const getTallerByCod = async (req, res, next) => {
    try{
        const response = await tallerService.findTallerByCod(req.db, req.params.codt);
        if (!response) {
            return res.status(404).json({ message: 'Taller no encontrado' });
        }
        res.status(200).json({
            status: 'success',
            data: response,
            message: 'Taller obtenido exitosamente'
        }); 
    }catch(error) {
        console.error('Error al obtener el taller:', error);
        res.status(500).json({message: 'error al obtener el taller', status: 'error'});
        next(error);
    }
}

const createTaller = async (req, res, next) => {
    try {
        const { codt } = req.body;

        const existe = await tallerService.findTallerByCod(req.db, codt);
        if (existe) {
            return res.status(409).json({ message: 'El código de taller ya existe' });
        }

        const response = await tallerService.createTallerDB(req.db, req.body);
        res.status(201).json({
            status: 'success',
            data: response,
            message: 'Taller creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el taller:', error);
        res.status(500).json({message: 'error al crear el taller', status: 'error'});
        next(error);
    }
}

const updateTaller = async (req, res, next) => {
    try {
        const response = await tallerService.updateTallerDB(req.db, req.params.codt, req.body.nombre, req.body.ciudad);
        if (!response) {
            return res.status(404).json({ message: 'Taller no encontrado' });
        }
        res.status(200).json({
            status: 'success',
            data: response,
            message: 'Taller actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar el taller:', error);
        res.status(500).json({message: 'error al actualizar el taller', status: 'error'});
        next(error);
    }
}

const deleteTaller = async (req, res, next) => {
    try {
        const response = await tallerService.deleteTallerDB(req.db, req.params.codt);
        if (!response) {
            return res.status(404).json({ message: 'Taller no encontrado' });
        }
        res.status(200).json({
            status: 'success',
            data: response,
            message: 'Taller eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar el taller:', error);
        res.status(500).json({message: 'error al eliminar el taller', status: 'error'});
        next(error);
    }
}

module.exports = { getTallerByCod, getAllTalleres, createTaller, updateTaller, deleteTaller };
