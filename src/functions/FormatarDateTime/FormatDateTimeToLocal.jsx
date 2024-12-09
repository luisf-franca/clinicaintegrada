const FormatarDateTimeToLocal = (dateTimeString) => {
    if (!dateTimeString) {
        return "Não especificado";
    }

    const dateObj = new Date(dateTimeString);

    // Formatar data (dia/mês/ano)
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Mês é baseado em zero
    const year = dateObj.getFullYear();

    // Formatar hora (horas:minutos)
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    // Retorna no formato DD/MM/AAAA, HH:mm
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

export default FormatarDateTimeToLocal;
