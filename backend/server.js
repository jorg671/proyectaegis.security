/**
 * Punto de entrada: carga las variables de entorno y arranca el servidor.
 * dotenv debe ir primero, porque los archivos de config leen process.env al cargarse.
 */
require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
