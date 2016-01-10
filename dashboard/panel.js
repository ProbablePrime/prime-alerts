'use strict';

var $panel = $bundle.filter('.notify');
var $type = $panel.find('input:radio[name="manualType"]');
var $name = $panel.find('.ctrl-name');
var $send = $panel.find('.ctrl-send');


$send.click(function () {
    var name = $name.find('input').val();
    var type = $type.filter(':checked').val();

    if (type === 'subscription') {
        nodecg.sendMessage('subscription', {
            name: name,
            ts:Date.now()
        });
    } else if (type === 'follow') {
        nodecg.sendMessage('follow', {
            name: name,
            ts:Date.now()
        });
    }
});
