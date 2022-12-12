export default class Get {
    async getDados(url=null, page=1, keyword=null){
        let response = await fetch(url, {
            method: 'GET',
            params: {page: page, keyword: keyword},
            headers: {
                //'X-RapidAPI-Key': 't5b5tbtybtybtybtybtybtybtbtybtybty',
                'X-RapidAPI-Key': '7846a98801msh0b57d262f87963bp1c3402jsn10bc4c067bbf',
                'X-RapidAPI-Host': 'amazon24.p.rapidapi.com'
            }
        }).then(response => response.json());

        return response.docs.map((x, i) => ({"id": Math.floor((Date.now()/Math.floor(Math.random() * (100000001 - 1000000) + 1000000)) * (i+1)), "title": x.product_title.substr(0, 50) + '...', "price": '$' + (x.app_sale_price || Math.floor((Math.random() * (101 - 1) + 1) * 100)/100), "quantity": Math.floor(Math.random() * (11 - 1) + 1)}));
    }
}