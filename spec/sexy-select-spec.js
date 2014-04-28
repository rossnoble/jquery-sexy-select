// Bind to custom events to make sure the inserted element
// is available when the tests are run.
//
// http://pivotallabs.com/tips-for-writing-testable-maintainable-page-specific-javascript/
$(document).on('content:loaded', function () {
  $('#test-container').remove();

  $('<div id="test-container"></div>').prependTo('body')
    .prepend('<div id="empty-div"></div>')
    .prepend('<select id="select-box">' +
      '<option value="1">One</option>' +
      '<option value="2">Two</option>' +
      '<option value="3">Three</option>' +
      '</select>'
    ).hide();
});

describe('Sexy Select', function () {

  var $testWrapper;

  beforeEach(function () {
    $(document).trigger('content:loaded');
    $testWrapper = $('#test-container');
  });

  it('bind to non existing element should not throw any errors', function () {
    var $ghost = $('#ghost');

    var bindSexy = function () {
      $ghost.sexySelect();
    };

    expect(bindSexy).not.toThrow();
    expect($ghost.length).toEqual(0);
  });

  it('bind to non-select element should not wrap with sexy select elements', function () {
    var $emptyDiv = $('#empty-div');

    var bindSexy = function () {
      $emptyDiv.sexySelect();
    };

    expect(bindSexy).not.toThrow();
    expect($emptyDiv.length).toEqual(1);
    expect($emptyDiv.parent().attr('id')).toEqual('test-container');
  });

  it('bind to select element should wrap with sexy select elements', function () {
    var $selectBox = $('#select-box');

    $selectBox.sexySelect();

    expect($selectBox.length).toEqual(1);
    expect($selectBox.parent().attr('id')).not.toEqual('test-container');
    expect($selectBox.parent().attr('class')).toEqual('sexy-select');
    expect($selectBox.prev().attr('class')).toEqual('sexy-select-options');
    expect($selectBox.prev().prev().attr('class')).toEqual('sexy-select-text');
  });

  it('bind to select element creates list of options that match select box options', function () {
    var $selectBox = $('#select-box');

    $selectBox.sexySelect();

    var $selectOptions = $selectBox.find('option'),
      $widgetOptions = $selectBox.siblings('.sexy-select-options').find('li'),
      $widgetText = $selectBox.siblings('.sexy-select-text');

    expect( $widgetOptions.length )
      .toEqual( $selectOptions.length );
    expect( $widgetOptions.first().data('value') )
      .toEqual( parseInt($selectOptions.first().val()) );
    expect( $widgetText.text() )
      .toEqual( $selectOptions.first().text() );
  });

  it('trigger change event on source element updates active option label', function () {
    var $selectBox = $('#select-box');
    $selectBox.sexySelect();
    var $widgetText = $selectBox.siblings('.sexy-select-text');

    expect( $widgetText.text() ).toEqual('One');
    expect( $selectBox.val() ).toEqual('1');

    $selectBox.val(2).trigger('change');

    expect( $selectBox.val() ).toEqual('2');
    expect( $widgetText.text() ).toEqual('Two');
  });

  it('change trigger change event on source element updates active option label', function () {
    var $selectBox = $('#select-box');

    $selectBox.sexySelect();

    var $widgetText = $selectBox.siblings('.sexy-select-text'),
      $widgetOptions = $selectBox.siblings('.sexy-select-options').find('li'),
      $widgetOptionsTarget = $($widgetOptions.get(2));

    expect( $widgetText.text() ).toEqual('One');
    expect( $selectBox.val() ).toEqual('1');
    expect( $widgetOptionsTarget.text() ).toEqual('Three');
    expect( $widgetOptionsTarget.attr('class') ).toEqual(undefined);

    $($widgetOptions.get(2)).trigger('click');

    expect( $selectBox.val() ).toEqual('3');
    expect( $widgetText.text() ).toEqual('Three');
    expect( $widgetOptionsTarget.attr('class') ).toEqual('active');
  });

});
