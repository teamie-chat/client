<div class="col-xs-3 panel-container" ng-class="{
    'panel-container-minimized': ui.minimize == 1
  }" ng-if="!ui.close">
  <div class="panel panel-thread panel-default" ng-class="{
      'panel-success': ui.highlight
    }">
    <div class="panel-heading">
      <div class="panel-heading-buttons pull-right">
        <div class="btn-group">
          <button type="button" class="btn btn-xs btn-default btn-resize" 
            ng-click="ui.minimize = !ui.minimize">
            <i class="glyphicon" ng-class="{ 
              'glyphicon-minus': ui.minimize == 0,
              'glyphicon-plus': ui.minimize == 1 }">
            </i>
          </button>
          <button type="button" class="btn btn-xs btn-default btn-close" ng-click="ui.close = 1">
            <i class="glyphicon glyphicon-remove"></i>
          </button>
        </div>
      </div>  
      <div class="panel-title" ng-if="title">
        {{ title }} <span class="badge badge-danger"> 2 </span>
      </div>
    </div>
    <div class="panel-content" ng-show="!ui.minimize">
      <div class="panel-body">
        {{ body }}
      </div>
      <div class="panel-footer">
        <textarea class="form-control" name="chat" rows="1"></textarea>
      </div>
    </div>
  </div>
</div>