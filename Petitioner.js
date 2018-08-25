"use strict";

var Petition = function (name, total_likes, decision) {

    this.name = name;
    this.total = total_likes;
    this.decision = decision;
};

Petition.prototype = {
    init: function () {

    }
};

var Data = function () {
    LocalContractStorage.defineMapProperty(this, "total_data");
    LocalContractStorage.defineProperty(this, "s_index");
};

Data.prototype = {
    init: function () {
        this.s_index = new BigNumber(1);
    },

    save_completion: function (name, total_likes, decision) {

        var id = this.s_index;

        if (name.length > 50) {
            throw new Error("Petition Length error");
        }

        if (name == "" || total_likes == "" || decision == "") {
            throw new Error("empty fields");
        }

        var petition = new Petition(name, total_likes, decision);

        this.total_data.put(new BigNumber(id).toNumber(), JSON.stringify(petition));

        this.s_index = new BigNumber(id).plus(1);

    },
    get_total: function () {
        var total = [];
        var total = new BigNumber(this.s_index).toNumber();
        for (let i = 1; i < total; i++) {
            total.push(JSON.parse(this.total_data.get(i)));
        }
        return total;

    }
}

module.exports = Data;