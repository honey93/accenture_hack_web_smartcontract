import Vue from 'vue'
import Vuex from 'vuex'

import {
  contractAddress,
  nebPay,
  result,
  NebPay
} from './neb_init';

Vue.use(Vuex)


// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 5,
  all_data: [],
  favourite_data: [],
  mystory_data: [],
  color_codes: ["#CDDC39", "#C2185B", "#5D4037", "#E64A19", "#9E9E9E", "#607D8B", "#1976D2", "#00796B"],
  extension: true,
  nodata_flag: false,
  nodata_flag_my: false,
  account_data: {},
  language: {
    english: true,
    chinese: false
  },
  add_line_flag: {
    status: false,
    message: "Transaction about to get initiated"
  }

}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  increment(state) {
    state.count++
  },
  all_data(state, payload) {
    //alert(JSON.stringify(payload));
    state.all_data = payload.reverse();
  },
  favourite_data(state, payload) {
    state.favourite_data = payload.result;
    state.nodata_flag = payload.status;
  },
  mystory_data(state, payload) {
    state.mystory_data = payload.result;
    state.nodata_flag_my = payload.status;
  },
  account_data(state, payload) {
    //alert(JSON.stringify(payload));
    state.account_data = payload;
  },
  flag_changed(state, payload) {

    //alert("called");

    state.add_line_flag.status = true;

    if (payload == 1) {
      state.add_line_flag.message = "Transaction Completed on the BlockChain Successfully";
      state.add_line_flag.status = true;

      this.app.router.push('/')

    }

    if (payload == 2) {
      state.add_line_flag.message = "Transaction Initiated";
      state.add_line_flag.status = true;
    }


  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  increment: ({
    commit
  }) => commit('increment'),
  call: (store) => {
    var args = "[]";
    nebPay.simulateCall(contractAddress, 0, "get_stories", args, {
      listener: function (data) {
        // commit(all_data,)
        // alert(data.result);
        //alert(typeof (JSON.parse(data.result)));
        if (data.result != null) {
          // alert(data.result);
          store.commit("all_data", JSON.parse(data.result));
        }

      }
    });
  },
  add_story: ({
    commit
  }, payload) => {
    // alert(payload);
    var args = "[\"" + payload.name + "\",\"" + payload.image_url + "\",\"" + payload.by + "\",\"" + payload.to + "\",\"" + payload.email + "\"]";
    nebPay.call(contractAddress, 0, "save_story", args, {
      listener: function (data) {

      }
    });

  },
  add_line: ({
    commit
  }, payload) => {

    var v = this;

    var serialNumber;
    var intervalQuery;
    // return new Promise((resolve, reject) => {
    var payload_temp = payload.name;
    var hash = payload.hash;
    var address = payload.address;
    var global_id = payload.global_id;
    // alert(JSON.stringify(payload));
    var args = "[\"" + payload_temp + "\",\"" + address + "\",\"" + hash + "\",\"" + global_id + "\"]";
    var options = {
      callback: NebPay.config.testnetUrl
    }
    serialNumber = nebPay.call(contractAddress, 0, "add_line", args, {
      callback: NebPay.config.testnetUrl,
      listener: function (data) {
        // alert(JSON.stringify(data));
        //resolve();
      }
    });



    function funcIntervalQuery() {
      nebPay.queryPayInfo(serialNumber, options) //search transaction result from server (result upload to server by app)
        .then(function (resp) {
          //resp is a JSON string
          //console.log("data didn't come");
          var respObject = JSON.parse(resp);

          console.log(resp);

          if (respObject.code == 1) {
            // store.state.add_line_flag.status = 1;
            //alert("success");
            commit("flag_changed", 0);
            // alert(store.state.add_line_flag.status);
          }


          if (respObject.data.status != 1 && respObject.code == 0) {
            // store.state.add_line_flag.status = 1;
            //alert("success");
            commit("flag_changed", 2);
            // alert(store.state.add_line_flag.status);
          }
          if (respObject.data.status == 1 && respObject.code == 0) {
            // store.state.add_line_flag.status = 1;
            //alert("success");
            commit("flag_changed", 1);
            
            clearInterval(intervalQuery);
           // router.push('/mystory');
            // alert(store.state.add_line_flag.status);
          }


          // if (respObject.code === 0) {
          //   console.log("tx result: " + resp);


          // }
          // if ((respObject.code === 1)) {
          //   //alert(JSON.stringify(respObject));
          //   //clearInterval(intervalQuery)
          // }
        })
        .catch(function (err) {
          // alert(err);
        });
    }







    //Set a periodically query
    intervalQuery = setInterval(function () {
      funcIntervalQuery();
      console.log("calling");
    }, 4000);



    // });

  },
  vote: ({
    commit
  }, payload) => {

    var args = "[\"" + payload.hash + "\",\"" + payload.address + "\"]";
    nebPay.call(contractAddress, 0, "vote", args, {
      listener: result
    });

  },
  favourite_call: ({
    commit,
    state
  }) => {
    var args = "[]";
    nebPay.simulateCall(contractAddress, 0, "favourite", args, {
      listener: function (data) {

        var result = JSON.parse(data.result);

        if (result.length) {

          commit("favourite_data", {
            "result": result,
            "status": false
          });
        } else {

          state.nodata_flag = true;

        }

      }
    });
  },
  mystory_call: ({
    commit
  }) => {
    var args = "[]";
    nebPay.simulateCall(contractAddress, 0, "my_stories_data", args, {
      listener: function (data) {

        var result = JSON.parse(data.result);


        if (result.length) {

          commit("mystory_data", {
            "result": result,
            "status": false
          });
        } else {

          state.nodata_flag_my = true;

        }

      }
    });
  },
  account_call: ({
    commit
  }) => {

    //alert("came in");
    var args = "[]";
    nebPay.simulateCall(contractAddress, 0, "account_data", args, {
      listener: function (data) {

        var result = JSON.parse(data.result);

        commit("account_data", result);


      }
    });
  }

}

// getters are functions
const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.


const createStore = () => {
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  });
};


export default createStore