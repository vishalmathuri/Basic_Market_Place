App = {
    contract: {},
    init: async function () {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let userAddress = await signer.getAddress();
      document.getElementById("wallet").innerText =
        "Your wallet is " + userAddress;
  
      const resourceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
      $.getJSON(
        "../artifacts/contracts/BasicMarketplace.sol/BasicMarketplace.json",
        function (BasicMarketplaceArtifact) {
          const contract = new ethers.Contract(
            resourceAddress,
            BasicMarketplaceArtifact.abi,
            signer
          );
          App.contract = contract;
          contract.getProducts().then((data) => {
            console.log(data);
            var allItemsDiv = $("#allItems");
            var itemTemplate = $("#itemTemplate");
            for (i = 0; i < data.length; i++) {
              itemTemplate.find(".itemName").text(data[i].title);
              itemTemplate.find(".itemOwner").text(data[i].owner);
              itemTemplate.find(".itemCreator").text(data[i].creator);
              itemTemplate.find(".askingPrice").text(data[i].askingPrice);
              itemTemplate
                .find(".itemStatus")
                .text(data[i].isSold ? "Sold" : "Available");
              itemTemplate.find(".buy_btn").attr("data-id", data[i].id);
              if (data[i].isSold) {
                itemTemplate.find(".buy_btn").hide();
              } else {
                itemTemplate.find(".buy_btn").show();
              }
  
              allItemsDiv.append(itemTemplate.html());
            }
          });
  
          return App.bindEvents();
        }
      );
    },
  
    bindEvents: function () {
      $(document).on("click", ".btn_add", App.handleAdd);
      $(document).on("click", ".buy_btn", { id: this.id }, App.handleBuy);
    },
    handleAdd: function () {
      console.log("Handling Add");
      var newItem = $("#new_itemname").val();
      var newAskingPrice = $("#new_askingprice").val();
      console.log(newItem + " at " + newAskingPrice);
      App.contract.addProduct(newItem, "new product", newAskingPrice);
    },
    handleBuy: function (event) {
      var productId = parseInt($(event.target).data("id"));
      console.log("Handling buy " + productId);
      App.contract.sellProduct(productId);
    },
  };

// Initialize the app on window load
$(window).on("load", function () {
    App.init();
});
