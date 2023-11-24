const {Client} = require('pg');

var client_info = {
    host:'localhost',
    user: 'vet_admin',
    port:5432,
    password:'v3t_4dm1n',
    database:'vet_db'
};

const query = async (query) => {
    const client = new Client(client_info);
    await client.connect();

    var result = await client.query(query);

    await client.end();

    // console.log(result);

    return result.rowCount ? JSON.stringify(result.rows[0]): null;
}

module.exports = {query};