'use strict';
import $ from 'jquery';
import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const synchAccounts = () => {
    $('#accounts').html("");
    web3.eth.accounts.forEach(account => {
        let balance = web3.eth.getBalance(account);
        $('#accounts').append(`<p><a href="#" class="from">from</a> <a href="#" class="to">to</a> | <span class="address">${account}</span> | <span class="balance">ETH (wei): ${balance}</span></p>`);
    });
};

const updateAddressFromLink = (event, inputSelector) => {
    event.preventDefault();
    $(inputSelector).val($(event.target).siblings(".address").text());
};

synchAccounts();
$(document).on('click', '.from', e => updateAddressFromLink(e, '#sender-address'));
$(document).on('click', '.to', e => updateAddressFromLink(e, '#recipient-address'));

// ETH transfer function
$('#send-ether').click(() => {
    let from = $('#sender-address').val();
    let to = $('#recipient-address').val();
    let amount = $('#amount').val();
    let transaction = { from: from, to: to, value: amount };
    console.log(`Sending transaction... ${JSON.stringify(transaction)}`);
    web3.eth.sendTransaction(transaction, function (error, transactionHash) {
        console.log(`Transaction: ${transactionHash}`);
        error ? $("#errors").text(error) : $("#transaction-hash").text(`Tx Hash: ${transactionHash}`);
        web3.eth.getTransaction(transactionHash, function (error, transactionInfo) {
            if (error) $("#errors").text(error);
            else {
                $("#transaction-info").find("#hash").text(transactionInfo.hash);
                $("#transaction-info").find("#nonce").text(transactionInfo.nonce);
                $("#transaction-info").find("#block-hash").text(transactionInfo.blockHash);
                $("#transaction-info").find("#block-number").text(transactionInfo.blockNumber);
                $("#transaction-info").find("#gas-usage").text(transactionInfo.gas);
                $("#transaction-info").find("#transaction-index").text(transactionInfo.transactionIndex);
                $("#transaction-info").find("#from").text(transactionInfo.from);
                $("#transaction-info").find("#to").text(transactionInfo.to);
                $("#transaction-info").find("#value").text(transactionInfo.value);
                synchAccounts();
            }
        })
    });
});