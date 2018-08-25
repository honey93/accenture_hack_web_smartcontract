"use strict";

var Story = function (text, image_url, by, to, email) {

    this.by = by;
    this.to = to;
    this.email = email;
    this.title = text;
    this.address = Blockchain.transaction.from;
    this.hash = Blockchain.transaction.hash;
    this.image_url = image_url;
    this.lines = [];
    this.votes = [];
};

Story.prototype = {
    init: function () {

    }
};

var Data = function () {
    LocalContractStorage.defineMapProperty(this, "favourite_stories");
    LocalContractStorage.defineMapProperty(this, "my_stories");
    LocalContractStorage.defineProperty(this, "s_index");
    LocalContractStorage.defineMapProperty(this, "stories_data");
};

Data.prototype = {
    init: function () {
        this.s_index = new BigNumber(1);
    },

    save_story: function (name, image_url, by, to, email) {

        var id = this.s_index;

        if (name.length > 50) {
            throw new Error("Petition Length error");
        }

        if (name == "" || by == "" || to == "" || email == "") {
            throw new Error("empty fields");
        }

        var story = new Story(name, image_url, by, to, email);

        this.stories_data.put(new BigNumber(id).toNumber(), JSON.stringify(story));

        var my_stories_local = this.my_stories.get(Blockchain.transaction.from) || [];

        my_stories_local.push(this.s_index);

        this.my_stories.put(Blockchain.transaction.from, my_stories_local);


        this.s_index = new BigNumber(id).plus(1);

    },
    get_stories: function () {
        var stories = [];
        var total = new BigNumber(this.s_index).toNumber();
        for (let i = 1; i < total; i++) {
            stories.push(JSON.parse(this.stories_data.get(i)));
        }
        return stories;

    },
    add_line: function (line, address, hash, gov_id) {

        if (line.length > 50) {
            throw new Error("Line Length Error");
        }

        var author = this.my_stories.get(address);

        var temp_data = [];

        author.map((i) => {
            temp_data.push(JSON.parse(this.stories_data.get(i)));
        });

        var vm = this;
        temp_data = temp_data.map(function (story, index) {
            if (story.hash == hash) {


                story.lines.map((content) => {
                    if (content.gov_id.toLowerCase() == gov_id.toLowerCase()) {
                        throw new Error("Already signed the Petition");
                    }
                });


                story.lines.push({
                    "line": line,
                    "from": Blockchain.transaction.from,
                    "gov_id": gov_id
                });
                vm.stories_data.put(new BigNumber(author[index]).toNumber(), JSON.stringify(story));

                var writer = vm.my_stories.get(Blockchain.transaction.from) || [];

                if (!writer.includes(author[index])) {
                    writer.push(author[index]);
                    vm.my_stories.put(Blockchain.transaction.from, writer);

                }

            }
            return story;
        });


    },

    my_stories_data: function () {

        var author = this.my_stories.get(Blockchain.transaction.from) || [];

        var temp_data = [];

        author.map((i) => {
            temp_data.push(JSON.parse(this.stories_data.get(i)));
        });

        return temp_data;

    },
    account_data: function () {
        var author = this.my_stories.get(Blockchain.transaction.from) || [];
        var favourite = this.favourite_stories.get(Blockchain.transaction.from) || [];
        var account_data = {};
        account_data.address = Blockchain.transaction.from;
        account_data.count_stories = author.length;
        account_data.count_favourite = favourite.length;

        return account_data;
    },
    vote: function (hash, address) {

        var author = this.my_stories.get(address);

        var temp_data = [];

        author.map((i) => {
            temp_data.push(JSON.parse(this.stories_data.get(i)));
        });

        var vm = this;
        temp_data = temp_data.map(function (story, index) {
            if (story.hash == hash) {
                if (story.votes.includes(Blockchain.transaction.from)) {
                    throw new Error("Can't vote more than once the same story");
                }
                story.votes.push(Blockchain.transaction.from);
                vm.stories_data.put(new BigNumber(author[index]).toNumber(), JSON.stringify(story));

                var favourite_local = vm.favourite_stories.get(Blockchain.transaction.from) || [];

                favourite_local.push(author[index]);

                vm.favourite_stories.put(Blockchain.transaction.from, favourite_local);

            }
            return story;
        });

    },
    favourite: function () {

        var author_favourite = this.favourite_stories.get(Blockchain.transaction.from) || [];

        var temp_data = [];

        author_favourite.map((i) => {
            temp_data.push(JSON.parse(this.stories_data.get(i)));
        });

        return temp_data;



    }

};

module.exports = Data;