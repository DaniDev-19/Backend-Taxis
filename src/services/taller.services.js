const AllTalleres = async (db) => {
    const { rows } = await db.query('SELECT * FROM taller');
    return rows;
}

const findTallerByCod = async (db, codt) => {
    const { rows } = await db.query('SELECT * FROM taller WHERE codt = $1', [codt]);
    return rows[0];
};

const createTallerDB = async (db, { codt, nombre, ciudad }) => {
    const { rows } = await db.query(
        'INSERT INTO taller (codt, nombre, ciudad) VALUES ($1, $2, $3) RETURNING *',
        [codt, nombre, ciudad]
    );
    return rows[0];
};

const updateTallerDB = async (db, codt, nombre, ciudad) => {
    const { rows } = await db.query('UPDATE taller SET nombre = $1, ciudad = $2 WHERE codt = $3 RETURNING *', [nombre, ciudad, codt]);
    return rows[0];
}

const deleteTallerDB = async (db, codt) => {
    const { rows } = await db.query('DELETE FROM taller WHERE codt = $1 RETURNING *', [codt]);
    return rows[0];
}

module.exports = { findTallerByCod, createTallerDB, updateTallerDB, AllTalleres, deleteTallerDB };