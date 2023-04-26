const invalidParamsProduct = (body)=>{
    return `Error ocurrio porque faltan los siguientes campos obligatorios. Los parametros obligatorios son:
    * Title: el titulo es un campo requerido y el ingresado es: ${body.title}
    * Description: el titulo es un campo requerido y el ingresado es: ${body.description}
    * Code: el titulo es un campo requerido y el ingresado es: ${body.code}
    * Price: el titulo es un campo requerido y el ingresado es: ${body.price}
    * Category: el titulo es un campo requerido y el ingresado es: ${body.category}
    `
};

const invalidId = (req)=> {
    return `Se necesita un id valido, el id ingresado es: ${req.params.id}
    `
};

module.exports = {
    invalidParamsProduct,
    invalidId,
}