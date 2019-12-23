App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Society.json", function(society) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Society = TruffleContract(society);
      // Connect provider to interact with contract
      App.contracts.Society.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var societyInstance;
  //  var loader = $("#loader");
    var content = $("#content");

  //  loader.show();
  //  content.hide();
    content.show();

    // Load contract data
    App.contracts.Society.deployed().then(function(instance) {
      societyInstance = instance;
      return societyInstance.AllMembersCount();
    }).then(function(AllMembersCount) {
      var membersInfor = $("#membersInfor");
      membersInfor.empty();

  //    var couponsInfor = $("#conponsInfor");
   //   couponsInfor.empty();

      var membersSelect = $('#membersSelect');
      membersSelect.empty();


      for (var i = 0; i < AllMembersCount; i++) {
        societyInstance.Members(i).then(function(member) {
          var id = member[0];
          var name = member[1];
          var address = member[2];
          var couponsCount = member[3];

          // Render candidate Result
          var memberTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + address + "</td><td>" + couponsCount + "</td></tr>"
          membersInfor.append(memberTemplate);

          // Render candidate ballot option
          var memberOption = "<option value='" + id + "' >" + name + "</ option>"
          membersSelect.append(memberOption);
          
       /*   for(var k = 0; k < couponsCount; k++){
            var couponid = societyInstance.getMemberCouponID(i,k);
            var couponEndDate = societyInstance.getMemberCouponEndDate(i,k);
            var couponTemplate = "<tr><th>" + couponid + "</th><td>" + couponEndDate + "</td></tr"
            couponsInfor.append(couponTemplate);
          }*/

        });
      }
    //  loader.hide();
      content.show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  spend: function() {
   // var memberId = $('#membersInfor').val();
    App.contracts.Society.deployed().then(function(instance) {
      var value = $("#number2").val();
      return instance.spendCoupon(value, 20191026, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
    //  $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  add: function() {
    var memberId = $('#membersInfor').val();
    App.contracts.Society.deployed().then(function(instance) {
      return instance.addCoupon(memberId, 20191026, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
    //  $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  transfer: function() {
    var memberId = $('#membersInfor').val();
    var value = $("#number1").val();
    App.contracts.Society.deployed().then(function(instance) {
      return instance.transferCoupon(memberId, value, 20191026, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
   //   $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
