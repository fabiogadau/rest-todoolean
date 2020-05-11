/*
* TODOOLEAN
- Creazione di una todo list con le seguenti funzionalità, attraverso l’uso delle API, AJAX, jQuery e Handlebars
- Lettura di tutti i todo
- Creazione nuovo todo
- Cancellazione todo
*/

$(document).ready(function() {

  /************************************************************************
  * References
  ************************************************************************/
  // Document references
  var todoInput = $('#todo-input');
  var todoBtn = $('#todo-btn');
  var todoList = $('.todo-list');

  // API
  var todoAPI = 'http://157.230.17.132:3004/todos';

  // Init Handlebars
  var source = $('#todo-template').html();
  var template = Handlebars.compile(source);

  
  /************************************************************************
  * Actions
  ************************************************************************/
  // Get and print all todos
  printTodos(template, todoAPI, todoList);

  // Create new todo by writing into input and clicking button
  todoBtn.click(function(){
    createTodo(template, todoAPI, todoList, todoInput);
  });

  // Create new todo by writing into input and Enter key keypress
  $(document).keypress(function(event){
    if ( event.which == 13 || event.keyCode == 13 ) {
      createTodo(template, todoAPI, todoList, todoInput);
    }
  });

  // Remove todo by clicking its button
  $(document).on('click', '.remove', function(){
    deleteTodo(template, todoAPI, todoList, $(this));
  });
  

  /************************************************************************* 
  * FUNCTIONS
  *************************************************************************/
  // Function to print todos
  function printTodos(template, newApi, newParent){
    // reset
    newParent.html('');

    // start AJAX call
    $.ajax({
      url: newApi,
      method: 'GET',
      success: function(result){
        var object = result;

        for ( var i = 0; i < object.length; i++ ) {
          var objectItem = object[i];

          var newObject = {
            todoText: objectItem.text,
            todoId: objectItem.id
          };

          var toPrint = template(newObject);
          newParent.append(toPrint);
        };
      },
      error: function(){
        console.log('Error occured while printing content');
      }
    }); // end AJAX call
  };
  
  // Function to create a new todo
  function createTodo(template, newApi, newParent, newInput){
    var newValue = newInput.val().trim();

    // start AJAX call
    $.ajax({
      url: newApi,
      method: 'POST',
      data: {
        text: newValue
      },
      success: function(){
        printTodos(template, newApi, newParent)

        newInput.val('');
      },
      error: function(){
        console.log('Error occured while creating content');
      }
    }); // end AJAX call
  };

  // Function to remove a todo
  function deleteTodo(template, newApi, newParent, self){
    var elementId = self.data('id');

    // start AJAX call
    $.ajax({
      url: newApi + '/' + elementId,
      method: 'DELETE',
      success: function(){
        printTodos(template, newApi, newParent)
      },
      error: function(){
        console.log('Error occured while deleting content');
      }
    });// end AJAX call
  };

}); // End document ready