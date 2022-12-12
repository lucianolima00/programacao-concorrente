self.onmessage = (array) => {
    let data = array.data;

    if(Math.floor(Math.random() * (2 - 0))){
        console.log('Worker decidiu nao comprar um produto');
    } else {
        let productIndex = (Math.floor(Math.random() * (15 - 0)) * 2);
        let quantity = Math.floor(Math.random() * (10 - 1) + 1);

        if (data[productIndex] && data[productIndex+1]) { //Verifica se o produto selecionado existe e tem saldo
            if(quantity <= data[productIndex+1]){
                Atomics.sub(data, productIndex+1, quantity)
                console.log('Worker comprou ' + quantity + ' do produto: ' + data[productIndex] + '. Quantidade depois da compra: ' + data[productIndex+1])
                self.postMessage([productIndex, quantity]);
            } else {
                console.log('Worker tentou comprar ' + quantity + ' de ' + data[productIndex] + ' que tinha: ' + data[productIndex+1])
                console.log('Estoque insuficiente');
            }
        } else {
            console.log('Produto nao existe');
        }
    }
};