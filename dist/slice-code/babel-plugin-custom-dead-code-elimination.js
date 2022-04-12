'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = customDeadCodeElimination;


function customDeadCodeElimination(_ref) {
  var t = _ref.types;

  return {
    visitor: {
      AssignmentExpression: function AssignmentExpression(path) {
        var _path$node = path.node,
            left = _path$node.left,
            right = _path$node.right;

        if (t.isIdentifier(left) && t.isIdentifier(right) && left.name === right.name) {
          path.remove();
        }
      },
      VariableDeclarator: function VariableDeclarator(path) {
        var id = path.get('id');
        if (t.isObjectPattern(id)) {
          id.get('properties').forEach(function (objectProperty) {
            findAndRemoveUnusedBindings(objectProperty, objectProperty.get('value'));
          });
        } else if (t.isArrayPattern(id)) {
          id.get('elements').forEach(function (element) {
            findAndRemoveUnusedBindings(element, element);
          });
        } else if (t.isIdentifier(id)) {
          var keepReferences = true; // TODO, there appears to be a bug with
          findAndRemoveUnusedBindings(path, id, keepReferences);
        } else {
          throw new Error('\n              slice-js does not yet support\n              VariableDeclarators with an id of type ' + id.type + '\n            ');
        }
      },
      ExpressionStatement: function ExpressionStatement(path) {
        if (t.isMemberExpression(path.node.expression)) {
          // foo.bar; (this could break code if there
          // are side-effects via getters)
          path.remove();
        }
      },

      Program: {
        // these are things we can only reasonably
        // try to remove after everything else has been removed.
        exit: function exit(path) {
          path.traverse({
            ObjectPattern: function ObjectPattern(objPath) {
              if (!objPath.node.properties.length) {
                // `var {} = foo` // don't ask me why....
                objPath.parentPath.remove();
              }
            },
            ArrayPattern: function ArrayPattern(arrPath) {
              if (!arrPath.node.elements.length) {
                // `var [] = foo` // don't ask me why...
                arrPath.parentPath.remove();
              }
            }
          });
        }
      }
    }
  };

  function findAndRemoveUnusedBindings(path, identifier) {
    if (isRemoved(path)) {
      return;
    }
    var referencePaths = getReferencePaths(path, identifier.node.name);
    if (isReferencingNothingButItself(identifier.node, referencePaths)) {
      path.remove();
    }
  }

  function getReferencePaths(path, name) {
    var binding = path.scope.getBinding(name) || { referencePaths: [] };
    return binding.referencePaths.filter(isNotRemoved);
  }

  function isReferencingNothingButItself(identifier, referencePaths) {
    return !referencePaths.length || referencePaths.length === 1 && referencePaths[0].node === identifier;
  }

  function isRemoved(path) {
    // if the path has a parent that has no node, then it has been removed
    return !!path.find(function (parent) {
      return !parent.node;
    });
  }

  function isNotRemoved(path) {
    return !isRemoved(path);
  }
}
module.exports = exports.default;