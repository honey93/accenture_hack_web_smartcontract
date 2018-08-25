<template>
  <div>
    <div class="loader" v-if="!$store.state.all_data.length"> <img src="~/assets/loading.gif"> </div>
    <div v-if="$store.state.all_data.length">
  
      <div class="col-md-12">
  
      </div>
  
      <div class="row">
  
        <div class="col-md-12 text-left">
  
          <p class="mar-0"><span v-if="$store.state.language.english"> Welcome !! This is a place to support petition by adding your voice to them ...  <nuxt-link to="/create"> Create Petition </nuxt-link> or add lines to them here. Visit
                                                      <nuxt-link to="/about"> About App </nuxt-link> to know more. </span>
            <span v-if="$store.state.language.chinese"> 
                                                      欢迎！这是合作故事/诗歌并评分他们的地方......  <nuxt-link to="/create"> 创造故事 </nuxt-link> 或在这里添加行（最多5）。更多信息，
                                                      <nuxt-link to="/about"> 关于App </nuxt-link> 
                                          了解更多。
                                                    </span>
  
          </p>
        </div>
  
        <div class="col-md-0 text-right">
  
          <!-- <b-pagination size="sm" :total-rows="$store.state.all_data.length" v-model="currentPage" :per-page="3">
                            </b-pagination> -->
  
        </div>
      </div>
  
      <div class="card-columns">
        <div class="card" v-for="(data,index) in $store.state.all_data" :key="index">
          <div>
            <b-card :header="data.title" class="aa">
              <div class="buttons_comment">
                <b-button  @click="showModal(data.title,data.hash,data.address)" size="sm" variant="warning">
                  <span v-if="$store.state.language.english">Write Line </span> <span v-if="$store.state.language.chinese">写一行 </span>
                </b-button>
  
  
                <social-sharing v-if="data.lines && data.lines.length" url="http://accenturehack.s3-website-eu-west-1.amazonaws.com" :title="data.title + ': ' +  line(data.lines)" description="Intuitive, Fast and Composable MVVM for building interactive interfaces."
                  hashtags="DApp,AccentureHackathon" twitter-user="Accenture @Nebulasio @HoneyThakuria" inline-template>
                  <network network="twitter">
  
                    <b-button size="sm" variant="primary" class="text-center tweet">
                      <i class="fab fa-twitter"></i> <span v-if="$store.state.language.english">Tweet </span> <span v-if="$store.state.language.chinese">推特</span>
                    </b-button>
                  </network>
  
  
                </social-sharing>
  
                <b-button class="like_button" @click="vote(data.hash,data.address)" size="sm" variant="success"> <i class="fas fa-heart"></i> {{data.votes.length}}
                </b-button>
                <hr >
              </div>
  
              <div v-if="data.image_url" >
                <img :src="data.image_url" width="100%">
              </div>
  
              <div class="cursive">
                <span :class="{para1:index == 0,para2:index ==1,para3:index ==2,para4:index ==3,para5:index ==4,para6:index ==5}" v-for="(line,index) in data.lines" :key="index">{{line.line}} ... </span>
                <footer v-if="data.lines.length">
  
                  <hr>
                  <p class="contributors"> Contributors - </p>
                  <span :class="{para1:index == 0,para2:index ==1,para3:index ==2,para4:index ==3,para5:index ==4,para6:index ==5}" v-for="(line,index) in data.lines" :key="index" class="from"> {{index+1}}) {{line.from}},   </span>
  
  
                </footer>
              </div>
               <hr>   
              <p> Petition by <span class="blue"> {{data.by}} </span> to <span class="red"> {{data.to}} </span> </p>
  
  
  
            </b-card>
          </div>
        </div>
  
      </div>
    </div>
  
  
  
    <b-modal ref="myModalRef" hide-footer :title="line_data.title">
      <div class="d-block text-center">
        <div role="group">
          <label  for="inputLive">New Line:</label>
          <b-form-input id="inputLive" v-model.trim="line_data.name" type="text" :state="nameState" aria-describedby="inputLiveHelp inputLiveFeedback" placeholder="Add New Line"></b-form-input>
           <b-form-invalid-feedback id="inputLiveFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            More than 5 and less than 50 letters
          </b-form-invalid-feedback>
           <br>
           <label for="inputLive">Identity Proof:</label>
          <b-form-input id="inputLive" v-model.trim="line_data.global_id" type="text"  aria-describedby="inputLiveHelp inputLiveFeedback" placeholder="Passport / SSN"></b-form-input>
         
        </div>
      </div>
      <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Submit</b-btn>
    </b-modal>
  
  
  
  </div>
</template>


<script>
import * as NebPay from "nebpay.js";

export default {
  updated() {},
  mounted() {
    this.$store.dispatch("call");
  },
  methods: {
    get() {
      //alert(this.count);
    },
    vote(hash, address) {
      this.$store.dispatch("vote", {
        hash: hash,
        address: address
      });
    },
    showModal(title, hash, address) {
      // alert(hash);
      this.line_data.title = title;
      this.line_data.hash = hash;
      this.line_data.address = address;
      this.line_data.name = "";
      this.line_data.global_id = "";
      this.$refs.myModalRef.show();
    },
    hideModal() {
      if (this.nameState) {
        //alert("resolved");
        //alert(JSON.stringify(this.line_data));
        var temp_data = this.line_data;
        var vm = this;
        if (temp_data.global_id != "") {
          this.$store.dispatch("add_line", temp_data);
        } else {
          alert("Id Proof is necessary");
        }

        this.$refs.myModalRef.hide();
      }
    },
    line(lines) {
      var line_array = lines.map(data => {
        return data.line;
      });

      return line_array.toString();
    }
  },
  computed: {
    nameState() {
      return this.line_data.name.length > 5 && this.line_data.name.length < 50
        ? true
        : false;
    }
  },
  data() {
    return {
      line_data: {
        name: "",
        title: "",
        hash: "",
        address: "",
        global_id: ""
      },
      count: 0,
      currentPage: 1
    };
  }
};
</script>

<style scoped>
.row > .col-md-4:nth-child(4n + 1) {
  clear: left !important;
}

.blue{
  color:blue;
}

.red{
  color:red;
}
</style>