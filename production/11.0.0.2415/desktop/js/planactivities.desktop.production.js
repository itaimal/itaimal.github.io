bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.plan",{},{init:function(n,t,i,r){var u=this;u.params=r||{};u.projectDashboard=i;u._super(n,t,r);u.CONTEXT_PLANACTIVITIES="PLANACTIVITIES";u.loadTemplates({"project-dashboard-menu":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.plan").concat("#project-dashboard-menu")})},renderContent:function(){var n=this;return n.content=$("<div><\/div>"),n.content},postRender:function(){var n=this;n.params&&n.params.contextsLeftSidebarCaseDashboard&&n.params.contextsLeftSidebarCaseDashboard.forEach(function(t){n.sub(t,$.proxy(n.updateView,n))})},updateView:function(n,t){var i=this,u,f,r,e;i.params=$.extend(i.params,t.args);i.clean();u=i.getContent().empty();f=i.getTemplate("project-dashboard-menu");i.params.menuPlanDashboard=i.params.menuPlanDashboard||{};$.extend(i.params.menuPlanDashboard,i.params.menuDashboard);r=!0;i.params.plan.currentState==="PENDING"&&i.params.radNumber===i.params.plan.id&&i.params.plan.contextualized===!1&&(r=!1);e={planState:i.params.plan.currentState,showCommentsOptionMenu:i.params.menuPlanDashboard.showCommentsOptionMenu,showFilesOptionMenu:i.params.menuPlanDashboard.showFilesOptionMenu,showTimeLineOptionMenu:i.params.menuPlanDashboard.showTimeLineOptionMenu&&r};f.render(e).appendTo(u);$("li[data-context='"+i.params.showContextByMenuDashboard.toUpperCase()+"']",i.content).addClass("active").siblings().removeClass("active");i.handlerEvents()},loadContentById:function(n){var t=this,i,r;n.preventDefault();i=$(n.target).closest("li");i.data("context")==="PLANBACK"?t.backParentPlan():i.hasClass("active")||(r=i.data("context"),r&&(t.pub("notify",{type:r.toUpperCase(),args:$.extend(t.params,{showContextByMenuDashboard:r})}),$("li[data-context='"+t.params.showContextByMenuDashboard.toUpperCase()+"']",t.content).addClass("active").siblings().removeClass("active")))},subMenuHandler:function(){var t=this,n=t.getContent(),i=$("[data-context='PLANCOMMENTS']",n),r=$("[data-context='PLANFILES']",n),u=$("[data-context='PLANTIMELINE']",n);$(".ui-bizagi-wp-project-tab-submenu a",n).on("click",function(){i.toggle();r.toggle();u.toggle()})},backParentPlan:function(){var n=this,i=n.pub("notify",{type:"NAVIGATOR_GETLEVEL"}),r=parseInt(i[0]),t=n.projectDashboard.getParamsByBackFromPlan(n.params,r);n.pub("notify",{type:t.typeContext,args:$.extend(n.params,t.paramsNotify)})},handlerEvents:function(){var n=this,t=n.getContent();n.subMenuHandler();$(".ui-bizagi-wp-project-tab-links a",t).on("click",$.proxy(n.loadContentById,n))},clean:function(){var n=this,t=n.getContent();$(".ui-bizagi-wp-project-tab-links a",t).off();n.params&&n.params.contextsLeftSidebarCaseDashboard&&n.params.contextsLeftSidebarCaseDashboard.forEach(function(t){n.unsub(t,$.proxy(n.updateView,n))})}});bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.plan",["workportalFacade","dataService","bizagi.workportal.services.behaviors.projectDashboard",bizagi.workportal.widgets.project.dashboard.menu.plan],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.content.dashboard",{},{init:function(n,t,i){var r=this;r._super(n,t,i);r.loadTemplates({"project-content-dashboard":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.content.dashboard").concat("#project-plan-content-dashboard")})},renderContent:function(){var n=this,t=n.getTemplate("project-content-dashboard");return n.content=t.render({}),n.content},postRender:function(){var n=this;setTimeout(function(){$(window).trigger("resize")},1e3)}});bizagi.injector.register("bizagi.workportal.widgets.project.content.dashboard",["workportalFacade","dataService",bizagi.workportal.widgets.project.content.dashboard],!0);
bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activities",{},{init:function(n,t,i,r,u){var f=this;f._super(n,t,u);f.serviceOrderActivitiesByTransitions=r;f.PENDING_PLAN="PENDING_PLAN";f.EXECUTING_PLAN="EXECUTING_PLAN";f.CONTEXT_PLANACTIVITIES="PLANACTIVITIES";f.CONTEXT_PLANOVERVIEW="PLANOVERVIEW";f.CONTEXT_PLANCREATE="PLANCREATE";f.plugins={};f.fromIndexEnabledSortingActivities=0;f.idActivityEditing="";f.plugins.notifier=i;f._statePlan=f.PENDING_PLAN;f.userPictures=[];f.loadTemplates({"plan-activities-main":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.activities").concat("#project-plan-activities"),"plan-activities-item":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.activities").concat("#project-plan-activities-item")})},renderContent:function(){var n=this;return n.content=$("<div><\/div>"),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_SUMMARY_PROGRESS_PLAN",$.proxy(n.onNotifySummaryProgressPlan,n));n.sub("UPDATE_INFO_PLAN",$.proxy(n.onNotifyUpdatePlan,n));n.sub("UPDATE_LIST_ACTIVITIES",$.proxy(n.renderWidgetByStatePlan,n));n.sub("UPDATE_ACTIVITY_INFO",$.proxy(n.refreshActivityRow,n))},onNotifySummaryProgressPlan:function(n,t){var i=this,r;i.params=$.extend(i.params,t.args);r=i.params.planState||i.params.plan.currentState;i._statePlan=r+"_PLAN";i.renderWidgetByStatePlan(n.type)},renderWidgetByStatePlan:function(n){var t=this;t.idActivityEditing="";var i=t.getContent().empty(),r=t.enableEventsOnActivitiesByCurrentContext(t.params.showContextByMenuDashboard),u=t.params.plan.activities.filter(function(n){return n.finishDate}).length,f={showContextByMenuDashboard:t.params.showContextByMenuDashboard,statePlan:t._statePlan,statePendingPlan:t.PENDING_PLAN,stateExecutingPlan:t.EXECUTING_PLAN,contextPlanActivities:t.CONTEXT_PLANACTIVITIES,plan:t.params.plan,showFormAddActivityByNotFinishedAllActivities:u!==t.params.plan.activities.length},e=t.getTemplate("plan-activities-main");e.render($.extend(t.params,f)).appendTo(i);(t._statePlan===t.PENDING_PLAN||t._statePlan===t.EXECUTING_PLAN)&&r&&(t.plugins.sortablelist=t.initializeSortableList(),t.addEventHandlers());t.setContentWrapper(i);$(".project-plan-activity-list",i).on("click","li",$.proxy(t.onClickEditActivity,t));$(".project-plan-activity-list",i).on("click","li .activity-view",$.proxy(t.onClickEditActivity,t));$(".project-plan-activity-list",i).on("click","li .bz-icon-trash-outline",$.proxy(t.onClickDeleteActivity,t));$(".project-plan-activity-list",i).on("click","li .item-workonit-button",$.proxy(t.onClickWorkonItActivity,t));if(t.params.showContextByMenuDashboard===t.CONTEXT_PLANACTIVITIES)$(".project-plan-activity-list",i).on("click","li .ui-bizagi-wrapper-parallel-icon",$.proxy(t.onClickChangeParallel,t));if(t._statePlan===t.PENDING_PLAN)$("a#to-execute-plan",i).on("click",$.proxy(t.onExecutePlan,t));else if(t._statePlan!=="CLOSED_PLAN")$("a#to-close-plan",i).on("click",$.proxy(t.onClosePlan,t));t.renderActivities();n&&n.type==="UPDATE_LIST_ACTIVITIES"&&t.updateTransitions()},getCopyObjectPlan:function(){var n=this;return{id:n.params.plan.id,name:n.params.plan.name,description:n.params.plan.description,dueDate:n.params.plan.dueDate,waitForCompletion:n.params.plan.waitForCompletion,currentState:n.params.plan.currentState,parentWorkItem:n.params.plan.parentWorkItem,creationDate:n.params.plan.creationDate,startDate:n.params.plan.startDate,idUserCreator:n.params.plan.idUserCreator,contextualized:n.params.plan.contextualized,activities:n.params.plan.activities}},enableEventsOnActivitiesByCurrentContext:function(n){var t=this;return n===t.CONTEXT_PLANACTIVITIES},onNotifyUpdatePlan:function(){var n=this;n.params.showContextByMenuDashboard===n.CONTEXT_PLANOVERVIEW&&($(".ui-bizagi-wp-project-plan-activities-header h3",n.content).text(n.params.plan.name),$(".ui-bizagi-wp-project-plan-activities-header p",n.content).text(n.params.plan.description))},initializeSortableList:function(){var n=this;return $(".project-plan-activity-list",n.content).kendoSortable({hint:function(n){var t=n.clone().width(n.width());return $("<ol class='project-plan-activity-list ui-bizagi-wp-nolist'><\/ol>").append(t)},change:$.proxy(n.onChangePosition,n),disabled:".disabled",end:function(t){if(t.newIndex<n.fromIndexEnabledSortingActivities)t.preventDefault();else if(t.oldIndex!==t.newIndex){n.serviceOrderActivitiesByTransitions.movePositionActivity(n.params.plan.activities,t.oldIndex,t.newIndex);var i=$(".project-plan-activity-list li",n.content).eq(t.newIndex);if(!n.canChangeToParallelActivity(n.params.plan.activities,i)){n.params.plan.activities[t.newIndex].parallel=!1;function r(){setTimeout(function(){$(".project-plan-activity-list li .wrapper-arrow-css i",n.content).eq(0).removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline")},50)}r(t.newIndex)}}}}).data("kendoSortable")},updateTransitions:function(){var n=this,t=$.Deferred(),i={idPlan:n.params.plan.id,transitions:n.getActualTransitions()};return $.when(n.dataService.changeTransitions(i)).always(function(r,u,f){f.status===500&&n.plugins.notifier.showErrorMessage(bizagi.localization.getResource("workportal-project-plan-activities-sorterror"),"error");n.params.plan.activities=n.orderActivitiesByTransitions(n.params.plan.activities,i.transitions);t.resolve()}),t.promise()},orderActivitiesByTransitions:function(n,t){var i=this;return i.serviceOrderActivitiesByTransitions.getActivitiesByTransitions(n,t)},getActualTransitions:function(){var n=this,t=n.serviceOrderActivitiesByTransitions.getActualTransitionsByActivities(n.params.plan.activities);return t.forEach(function(t){t.id=undefined;t.idPlan=n.params.plan.id}),t},onChangePosition:function(){var n=this;n.updateTransitions()},onCreateActivity:function(n){var i;n.preventDefault();var t=this,f=$("#project-plan-activity-create",$(n.target)),r=f.val(),u;u=t.params.plan.activities.length>0?t.params.plan.activities[t.params.plan.activities.length-1].userAssigned:bizagi.currentUser.idUser;r.replace(/\s/g,"")!==""&&(i={progress:0,id:"",startDate:null,duration:null,userAssigned:u,allowEdition:!0,description:null,name:r,idPlan:t.params.plan.id,estimatedFinishDate:null,finishDate:null},$.when(t.dataService.createPlanActivity(i)).always(function(n,r,u){var f,e;u.status===201?(f=$.extend(i,{id:n.id,items:[],numTotalItems:0,numResolvedItems:0,parallel:!1}),t.renderActivities([f]),t.params.plan.activities.push(f),e=$(".project-plan-activity-list",t.content),$("li:last .bz-icon-pencil-outline",e).trigger("click"),t.updateTransitions()):n.status===500&&t.plugins.notifier.showErrorMessage(bizagi.localization.getResource("workportal-project-plan-activities-createarror"),"error")}));n.target.reset();n.preventDefault()},onClickChangeParallel:function(n){var r;n.preventDefault();var t=this,i=$(".wrapper-arrow-css",n.currentTarget),u=i.closest("li"),f=u.data("id");t.canChangeToParallelActivity(t.params.plan.activities,u)&&($("i",i).hasClass("bz-icon-arrow-down-outline")?(r=!0,$("i",i).removeClass("bz-icon-arrow-down-outline").addClass("bz-icon-arrow-right-outline").prop("title",bizagi.localization.getResource("workportal-project-plan-activity-parallel"))):(r=!1,$("i",i).removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline").prop("title",bizagi.localization.getResource("workportal-project-plan-activity-sequential"))),t.changeActivityProperties(f,{parallel:r}),t.updateTransitions())},canChangeToParallelActivity:function(n,t){var e=this,i=!0,r=e.getLastParallelActivityIsRunningOrClose(n),u,f;return r&&(u=t.prev(),f=u.data("id"),r===f&&(i=!1)),i},onClickEditActivity:function(n){var t=this,i=$(n.currentTarget),r=i.data("id"),u=t.params.plan.activities.filter(function(n){return n.id===r})[0],f=t._statePlan!=="CLOSED_PLAN"&&u.workItemState!=="Completed";if(t.params.showContextByMenuDashboard===t.CONTEXT_PLANACTIVITIES){function e(n){t.idActivityEditing!==n&&(t.params.plan.idActivitySelected=n,i.closest("li").addClass("selected").siblings().removeClass("selected"),t.idActivityEditing=n,t.pub("notify",{type:"EDITACTIVITY",args:$.extend(t.params,{isEditableFormActivity:f,idActivityToShow:n})}),t.pub("notify",{type:"OPEN_RIGHT_SIDEBAR"}))}e(r)}},changeActivityProperties:function(n,t){for(var r=this,i=0,u=r.params.plan.activities.length;i<u;i+=1)if(r.params.plan.activities[i].id===n){$.extend(r.params.plan.activities[i],t);break}},addEventHandlers:function(){var n=this;$("#project-plan-activity-createform",n.content).on("submit",$.proxy(n.onCreateActivity,n));$("#project-plan-activity-create",n.content).focus()},renderActivities:function(n){var t=this,r=$(".project-plan-activity-list",t.content),o=t.getTemplate("plan-activities-item"),i,u,f,e;t.params.showContextByMenuDashboard===t.CONTEXT_PLANACTIVITIES&&r.addClass("enabled-actions");i=t.params.plan.currentState==="PENDING"?$("a#to-execute-plan",t.content):$("a#to-close-plan",t.content);n||t.params.plan.activities.length>0?i.show():i.hide();u=n||t.params.plan.activities;f={statePlan:t._statePlan,statePendingPlan:t.PENDING_PLAN,stateExecutingPlan:t.EXECUTING_PLAN,context:t.params.showContextByMenuDashboard,activities:n||t.params.plan.activities,currentUserId:bizagi.currentUser.idUser};t._statePlan===t.EXECUTING_PLAN&&u.forEach(function(n){n.classEnabledActionActivities=n.startDate?"disabled":t.params.showContextByMenuDashboard===t.CONTEXT_PLANACTIVITIES?"enabled":"disabled";n.isRunning=t.runningActivity(n)});e=o.render(f);r.append(e);t.fromIndexEnabledSortingActivities=t.params.plan.activities.filter(function(n){return n.classEnabledActionActivities==="disabled"}).length;t.loadAndShowImagesUsers(t.params.plan.activities)},runningActivity:function(n){return n.workItemState==="Active"||n.workItemState==="Inactive"},loadAndShowImagesUsers:function(n){function r(n){for(var t,r={},u=[],f=n.length,e=0,i=0;i<f;i+=1)t=n[i],r[t]!==1&&(r[t]=1,u[e+=1]=t);return u}var t=this,i=$.map(n,function(n){return n.userAssigned}),u=r(i.concat(bizagi.currentUser.idUser)).join(",");t.getDataUsers(u).then(function(){t.renderUserProfilesAndImages()})},renderUserProfilesAndImages:function(){for(var t=this,n=0;n<t.userPictures.length;n+=1)$("div[data-iduser='"+t.userPictures[n].id+"']  span.ui-bizagi-user-initials").html(t.userPictures[n].name.getInitials()),t.userPictures[n].picture&&($("div[data-iduser='"+t.userPictures[n].id+"']  img").show(),$("div[data-iduser='"+t.userPictures[n].id+"']  span.ui-bizagi-user-initials").hide(),$("div[data-iduser='"+t.userPictures[n].id+"']  img").attr("src","data:image/png;base64,"+t.userPictures[n].picture))},getDataUsers:function(n){var t=this,i=$.Deferred(),r={userIds:n,width:50,height:50};return t.dataService.getUsersData(r).always(function(n){function r(n){for(var i,t=n.concat(),r=0;r<t.length;++r)for(i=r+1;i<t.length;++i)t[r]===t[i]&&t.splice(i-=1,1);return t}t.userPictures=r(t.userPictures.concat(n));i.resolve(n)}),i.promise()},onCancelActivityForm:function(){var n=this;n.pub("notify",{type:"PLANSIDEBAR",args:n.params})},setContentWrapper:function(n){var t=this,i=$(".project-plan-content-wrapper",n),r,u,f;i.on("click",$.proxy(t.onCancelActivityForm,t));r=$("#project-plan-activities-wrapper",n);r.on("click",function(n){n.stopPropagation()});u=$(window).height();f=u-156;i.css("height",f+"px")},onClickDeleteActivity:function(n){var t=this,i=$(n.currentTarget).data("id"),r={idPlan:t.params.plan.id,id:i};$.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-activity-delete-confirmation"),"","info")).done(function(){$.when(t.dataService.deleteActivityPlan(r)).done(function(){for(var n=0,r=t.params.plan.activities.length;n<r;n+=1)t.params.plan.activities[n].id===i&&r>n+1&&n>0&&t.params.plan.activities[n+1].parallel&&t.params.plan.activities[n-1].parallel&&(t.params.plan.activities[n+1].parallel=!1,$(".project-plan-activity-list li[data-id='"+t.params.plan.activities[n].id+"']",t.content).next().find(".wrapper-arrow-css i").removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline"));t.params.plan.activities=t.params.plan.activities.filter(function(n){return n.id!==i});$.when(t.updateTransitions()).done(function(){t.renderWidgetByStatePlan();t.pub("notify",{type:"PLANSIDEBAR",args:t.params})})})})},onClickWorkonItActivity:function(n){n.preventDefault();var t=this,r=$(n.target).closest("li").data("id"),i=t.params.plan.activities.filter(function(n){return n.id===r})[0];t.publish("executeAction",{action:bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,idCase:i.idCase,idWorkItem:i.idWorkItem})},onExecutePlan:function(n){var t,i,r;n.preventDefault();t=this;i=t.params.plan.activities.length;i>0?$(n.target).closest("a").hasClass("disabled")||(t.params.planState="EXECUTING",t.params.plan.currentState="EXECUTING",$(n.target).closest("a").addClass("disabled"),r={idPlan:t.params.plan.id},$.when(t.dataService.putExecutePlan(r)).done(function(){var i=$.extend(t.getCopyObjectPlan(),{startDate:t.getDateServer()});t.callUpdatePlan(i);$(n.target).closest("a").removeClass("disabled");t.pub("notify",{type:"PLANACTIVITIES",args:$.extend(t.params,{refreshAllWidgets:!0})})})):t.plugins.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-project-plan-action-execute-message-activities-required"),""))},onClosePlan:function(n){var t=this;n.preventDefault();t.activitiesAreCompleted(t.params.plan.activities)?t.closePlan():$.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-action-close-message-activities-finished"),"","info")).done(function(){t.closePlan()})},closePlan:function(){var n=this,t=$.extend(n.getCopyObjectPlan(),{currentState:"CLOSED"});$.when(n.callUpdatePlan(t)).done(function(){$.when(n.callClosePlan({idPlan:t.id})).done(function(){n.params.planState="CLOSED";n.params.plan=t;n.pub("notify",{type:"LOAD_INFO_SUMMARY_PLAN",args:n.params});n.pub("notify",{type:"LOAD_INFO_SUMMARY_PROGRESS_PLAN",args:n.params})}).fail(function(){n.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-project-plan-close-fail"),""))})}).fail(function(){n.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-project-plan-close-fail"),""))})},callUpdatePlan:function(n){var t=this;return $.when(t.dataService.updatePlan(n)).done(function(){$.extend(t.params.plan,n)})},callClosePlan:function(n){var t=this;return $.when(t.dataService.closePlan(n)).done(function(){$.extend(t.params.plan,n);t.plugins.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-project-plan-close-success"),""))})},activitiesAreCompleted:function(n){var t=n||[],i=t.filter(function(n){return n.finishDate}).length;return i===n.length},getLastParallelActivityIsRunningOrClose:function(n){var t=-1,i=n.filter(function(n){if(n.startDate!==null&&n.parallel)return t+=1,!0});return t>=0&&t+1!==n.length?i[i.length-1].id:null},refreshActivityRow:function(n,t){var u=this,i=$(".project-plan-activity-list li.selected"),f,r;t.args.displayName&&$("p>span",i).text(t.args.displayName);t.args.assignee&&(f=$(i).data("id"),r=u.params.plan.activities.filter(function(n){return n.id===f})[0],t.args.assignee===bizagi.currentUser.idUser&&(r.workItemState==="Active"||r.workItemState==="Inactive")?$(".item-workonit-button",i).show():$(".item-workonit-button",i).hide(),u.getDataUsers([t.args.assignee].join()).then(function(n){if($(".bz-wp-avatar span.ui-bizagi-user-initials",i).html(n[0].name.getInitials()),n[0].picture)$(".bz-wp-avatar img",i).show(),$(".bz-wp-avatar  span.ui-bizagi-user-initials",i).hide(),$(".bz-wp-avatar img",i).attr("src","data:image/png;base64,"+n[0].picture)}))}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.activities",["workportalFacade","dataService","notifier","bizagi.workportal.services.behaviors.orderActivitiesByTransitions",bizagi.workportal.widgets.project.plan.activities],!0);
bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.sidebar",{},{init:function(n,t,i,r){var u=this;u._super(n,t,r);u.serviceloadDataPlan=i;u.params=r||{};r.supportNav=!1;u.loadTemplates({"project-plan-sidebar":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.plan.sidebar").concat("#project-plan-sidebar")})},renderContent:function(){var n=this,t=n.getTemplate("project-plan-sidebar");return n.content=t.render({}),$.when(n.areTemplatedLoaded()).done(function(){var t={idPlan:n.params.plan.id};n.params.planChild&&n.params.planChild.id&&(t.idPlan=n.params.planChild.id);n.serviceloadDataPlan.loadData(t,n.getDateServer,n.params);n.serviceloadDataPlan.subscribe("loadedWithDataActivities",$.proxy(n.loadedWithDataActivities,n));n.serviceloadDataPlan.subscribe("loadedWithDataFirstParent",$.proxy(n.loadedWithDataFirstParent,n))}),n.content},loadedWithDataActivities:function(){var n=this;n.pub("notify",{type:"LOADED_ACTIVITIES_PLAN",args:n.params});n.pub("notify",{type:"UPDATE_INFO_PLAN",args:n.params});n.pub("notify",{type:"LOAD_INFO_SUMMARY_PROGRESS_PLAN",args:n.params});n.pub("notify",{type:"LOAD_INFO_ACTIVITIES_PLAN",args:n.params})},loadedWithDataFirstParent:function(){var n=this;n.pub("notify",{type:"LOAD_INFO_SUMMARY_PLAN",args:n.params})},clean:function(){var n=this;n.serviceloadDataPlan&&(n.serviceloadDataPlan.unsubscribe("loadedWithDataActivities",$.proxy(n.loadedWithDataActivities,n)),n.serviceloadDataPlan.unsubscribe("loadedWithDataFirstParent",$.proxy(n.loadedWithDataFirstParent,n)))}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.sidebar",["workportalFacade","dataService","bizagi.workportal.services.behaviors.loadDataPlan",bizagi.workportal.widgets.project.plan.sidebar],!0);
bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.action",{},{init:function(n,t,i,r,u,f,e){var o=this;o._super(n,t,e);o.PENDING_PLAN="PENDING";o.EXECUTING_PLAN="EXECUTING";o.CLOSED_PLAN="CLOSED";o.CONTEXT_ACTIVITYPLAN="ACTIVITYPLAN";o.CONTEXT_ACTIVITYPLANOVERVIEW="ACTIVITYPLANOVERVIEW";o.CONTEXT_PLANCREATE="PLANCREATE";o.CONTEXT_ACTIVITYPLANCREATE="ACTIVITYPLANCREATE";o.showActionsPlan=!1;o.projectDashboard=i;o.notifier=r;o.planTemplateCreate=u;o.planPopupEdit=f;o.loadTemplates({"plan-action-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.action").concat("#project-plan-action")})},renderContent:function(){var n=this,t=n.getTemplate("plan-action-main");return n.showActionsPlan=n.params.showContextByMenuDashboard!==n.CONTEXT_ACTIVITYPLAN&&n.params.showContextByMenuDashboard!==n.CONTEXT_ACTIVITYPLANOVERVIEW,n.plugins={},n.content=t.render({plan:n.params.plan.name,stateClosedPlan:n.CLOSED_PLAN,currentStatePlan:n.params.plan.currentState,showActionsPlan:n.showActionsPlan}),n.showActionsPlan&&(n.params.plan.contextualized=typeof n.params.plan.contextualized=="undefined"?!0:n.params.plan.contextualized),n.content},postRender:function(){var n=this,t=n.getContent();if(n.showActionsPlan){n.initilizeActionMenu();$("a#to-close-plan",t).on("click",$.proxy(n.onClosePlan,n))}n.sub("LOAD_INFO_SUMMARY_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n));n.clearAlertsOnFocus();n.planTemplateCreate.sub("planTemplateCreatedSuccess",function(){n.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-project-plan-create-template-success"),""))});n.planTemplateCreate.sub("planTemplateCreatedFailed",function(){n.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-project-plan-create-template-fail"),""))});n.planPopupEdit.sub("planEditedSuccess",function(){n.setNamePlan(n.params.plan.name);n.pub("notify",{type:"UPDATE_INFO_PLAN"});n.pub("notify",{type:"LOAD_INFO_SUMMARY_PLAN",args:n.params});n.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-project-plan-edit-success"),""))});n.planPopupEdit.sub("planEditedFailed",function(){n.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-project-plan-edit-fail"),""))});n.sub("EXPANDED_RIGHT_SIDEBAR",$.proxy(n.onNotifyExpandedRightSidebar,n))},onNotifyExpandedRightSidebar:function(){var n=this;n.showActionsPlan&&n.initilizeActionMenu()},onNotifyLoadInfoSummaryPlan:function(){var n=this;n.setStatePlan(n.params.plan.currentState);n.setNamePlan(n.params.plan.name)},setStatePlan:function(n){var t=this;if(n)switch(n.toUpperCase()){case"PENDING":$(".state-pending-plan",t.content).show().siblings().hide();break;case"EXECUTING":$(".state-executing-plan",t.content).show().siblings().hide();break;case"CLOSED":$(".state-closed-plan",t.content).show().siblings().hide()}},setNamePlan:function(n){var t=this;$(".ui-bizagi-wp-project-plan-header .bz-wp-section",t.content).text(n)},onSelectMenu:function(n,t){var i=this,r;if($(n.currentTarget).find("i").length===0){r=$(t.item).data("item");switch(r){case"edit":i.onClickMenuOpenEdition();break;case"delete":i.onClickMenuDeletePlan();break;case"saveastmpl":i.onClickMenuSaveAsTemplate()}}},onClickMenuOpenEdition:function(){var n=this,t=n.params.plan;n.planPopupEdit.showPopup(n.params,n.dataService,t)},onClickMenuSaveAsTemplate:function(){var n=this;n.planTemplateCreate.showPopupAddTemplatePlan(n.params,n.dataService,n.params.plan.contextualized,n.params.plan.id)},onClickMenuDeletePlan:function(){var n=this;$.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-action-delete-confirmation"),"","info")).done(function(){var t={id:n.params.plan.id};$.when(n.callDeletePlan(t)).done(function(){var i=n.pub("notify",{type:"NAVIGATOR_GETLEVEL"}),r=parseInt(i[0]),t=n.projectDashboard.getParamsByBackFromPlan(n.params,r,!0);n.pub("notify",{type:t.typeContext,args:$.extend(n.params,t.paramsNotify)})})})},onSubmitFormPlan:function(n){n.preventDefault()},initilizeActionMenu:function(){var n=this;$(".ui-bizagi-wp-project-plan-action-menu",n.content).menu({select:$.proxy(n.onSelectMenu,n)}).removeClass("ui-widget-content")},clearAlertsOnFocus:function(){$(".ui-bizagi-wp-project-container-validator-relative input, .ui-bizagi-wp-project-container-validator-relative textarea").focus(function(){$(this).parent().find(".k-invalid-msg").hide()}).focusout(function(){$(this).val().length<1&&$(this).parent().find(".k-invalid-msg").show()})},callDeletePlan:function(n){var t=this;return $.when(t.dataService.deletePlan(n)).done(function(){$.extend(t.params.plan,n);t.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-project-plan-delete-success"),""))})},clean:function(){var n=this;n.planTemplateCreate.unsub("planTemplateCreatedSuccess");n.planTemplateCreate.unsub("planTemplateCreatedFailed");n.planPopupEdit.unsub("planEditedSuccess");n.planPopupEdit.unsub("planEditedFailed");n.unsub("EXPANDED_RIGHT_SIDEBAR",$.proxy(n.onNotifyExpandedRightSidebar,n))}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.action",["workportalFacade","dataService","bizagi.workportal.services.behaviors.projectDashboard","notifier","bizagi.workportal.widgets.project.plan.template.create","bizagi.workportal.widgets.project.plan.edit",bizagi.workportal.widgets.project.plan.action],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.state",{},{init:function(n,t,i){var r=this;r._super(n,t,i);r.loadTemplates({"plan-state-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.state").concat("#project-plan-state")})},renderContent:function(){var n=this,t=n.getTemplate("plan-state-main");return n.content=t.render({}),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_SUMMARY_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n))},onNotifyLoadInfoSummaryPlan:function(n,t){var i=this,r;i.params=$.extend(i.params,t.args);r=i.params.planState||i.params.plan.currentState;switch(r.toUpperCase()){case"PENDING":$(".state-pending",i.content).show().siblings().hide();break;case"EXECUTING":$(".state-executing",i.content).show().siblings().hide();break;case"CLOSED":$(".state-closed",i.content).show().siblings().hide()}}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.state",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.state],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.progress",{},{init:function(n,t,i){var r=this;r._super(n,t,i);r.loadTemplates({"plan-progress-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.progress").concat("#project-plan-progress")})},renderContent:function(){var n=this;return n.content=$("<div><\/div>"),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_SUMMARY_PROGRESS_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n))},onNotifyLoadInfoSummaryPlan:function(n,t){var i=this,f,e,o;i.params=$.extend(i.params,t.args);var u=i.getContent().empty(),s=i.calculateProgress(),r={};r.progress=s;r.colorBar=r.progress<33?"Red":r.progress<66?"Yellow":"Green";f=i.getTemplate("plan-progress-main");f.render(r).appendTo(u);e=$(".remaining-days .time-remaining",u);o=$(".remaining-days .days",u).width();e.css("padding-left",(o+7).toString()+"px")},calculateProgress:function(){var n=this,t=0,i=n.params.plan.activities.length,r=0;return i!==0&&(n.params.plan.activities.forEach(function(n){n.workItemState==="Completed"&&t++}),r=Math.round(t/i*100)),r}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.progress",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.progress],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.time",{},{init:function(n,t,i){var r=this;r._super(n,t,i);r.PENDING_PLAN="PENDING";r.EXECUTING_PLAN="EXECUTING";r.CLOSED_PLAN="CLOSED";r.datePickerRegional=bizagi.localization.getResource("datePickerRegional");r.loadTemplates({"plan-time-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.time").concat("#project-plan-time")})},renderContent:function(){var n=this,t=n.getTemplate("plan-time-main");return n.content=t.render({}),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_SUMMARY_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n))},onNotifyLoadInfoSummaryPlan:function(n,t){var i=this;i.params=$.extend(i.params,t.args);i.params.plan&&(i.params.plan.dueDate?i.params.plan.currentState===i.PENDING_PLAN||i.params.plan.currentState===i.EXECUTING_PLAN?i.updateWidget(n,t):i.sub("LOADED_ACTIVITIES_PLAN",$.proxy(i.updateWidget,i)):i.getContent().empty())},updateWidget:function(n,t){var i=this,r;i.params=$.extend(i.params,t.args);r=i.getContent().empty();i.params.plan.currentState===i.CLOSED_PLAN&&i.getClosedDatePlan(i.params.plan);$.when(i.getIntervalOnMinutes(i.params.plan)).done(function(n){var u=bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now()-n*6e4),null,!0),o=u.replace(/\d/g,""),s=i.getKeywordDifferenceDates(i.params.plan),t=bizagi.localization.getResource("workportal-project-plan-state-"+s);t=t.replace("%s",o);var h=u.replace(/\D/g,""),f=i.getSecondDate(i.params.plan),e=i.getWidthBar(i.params.plan),c=i.getColorBarByPercent(e),l={fromDate:i.getFormattedDate(new Date(i.getFirstDate(i.params.plan))),toDate:f?i.getFormattedDate(new Date(f)):null,valueOfTimeCalculated:h,messageDescripionDifference:t,percentBar:e,colorBar:c},a=i.getTemplate("plan-time-main");a.render(l).appendTo(r)})},getFirstDate:function(n){var t=this;switch(n.currentState){case t.PENDING_PLAN:return n.dueDate?n.dueDate:n.creationDate;case t.EXECUTING_PLAN:case t.CLOSED_PLAN:return n.startDate}},getSecondDate:function(n){var t=this;switch(n.currentState){case t.PENDING_PLAN:return null;case t.EXECUTING_PLAN:return n.dueDate;case t.CLOSED_PLAN:return n.closedDate}},getLastActivity:function(n){var t=JSON.parse(JSON.stringify(n));return t.sort(function(n,t){return n.finishDate<t.finishDate?1:-1})[0]},getClosedDatePlan:function(n){var t=this;return n.closedDate=t.getLastActivity(n.activities).finishDate,n.closedDate},getDifferenceBetweenDates:function(n,t){var r=this,i=$.Deferred(),u={idUser:bizagi.currentUser.idUser,fromDate:n,toDate:t};return $.when(r.callGetEffectiveDuration(u)).done(function(n){i.resolve(n.minutes)}),i.promise()},getIntervalOnMinutes:function(n){var t=this,i=$.Deferred();switch(n.currentState){case t.PENDING_PLAN:n.dueDate>Date.now()?$.when(t.getDifferenceBetweenDates(Date.now(),n.dueDate)).done(function(n){i.resolve(n)}):$.when(t.getDifferenceBetweenDates(n.dueDate,Date.now())).done(function(n){i.resolve(n)});break;case t.EXECUTING_PLAN:n.dueDate?n.dueDate>Date.now()?$.when(t.getDifferenceBetweenDates(Date.now(),n.dueDate)).done(function(n){i.resolve(n)}):$.when(t.getDifferenceBetweenDates(n.dueDate,Date.now())).done(function(n){i.resolve(n)}):$.when(t.getDifferenceBetweenDates(n.startDate,Date.now())).done(function(n){i.resolve(n)});break;case t.CLOSED_PLAN:$.when(t.getDifferenceBetweenDates(n.startDate,n.closedDate)).done(function(n){i.resolve(n)})}return i.promise()},getKeywordDifferenceDates:function(n){var t=this;switch(n.currentState){case t.PENDING_PLAN:return n.dueDate>Date.now()?"remaining":"exceeded";case t.EXECUTING_PLAN:return n.dueDate?n.dueDate>Date.now()?"remaining":"exceeded":"opened";case t.CLOSED_PLAN:return"executed"}},getRelativeTime:function(n){return bizagi.util.dateFormatter.getRelativeTime(n,null,!1)},getWidthBar:function(n){var i=this,t={},r,u,f,e;switch(n.currentState){case i.PENDING_PLAN:return n.dueDate?n.dueDate<Date.now()?100:(r=n.dueDate-n.creationDate,u=Date.now()-n.creationDate,Math.ceil(u*100/r)):100;case i.EXECUTING_PLAN:return n.dueDate?n.dueDate>Date.now()?(f=n.dueDate-n.startDate,t=Date.now()-n.startDate,Math.ceil(t*100/f)):100:100;case i.CLOSED_PLAN:return n.closedDate>Date.now()?(e=n.closedDate-n.startDate,t=Date.now()-n.startDate,Math.ceil(t*100/e)):100}},getColorBarByPercent:function(n){return n<33?"Red":n<66?"Yellow":"Green"},callGetEffectiveDuration:function(n){var i=this,t=$.Deferred();return $.when(i.dataService.getEffectiveDuration(n)).done(function(n){t.resolve(n)}),t.promise()},getFormattedDate:function(n){var t=this,i=t.datePickerRegional.monthNames,r=n.getMonth();return i[r]+" "+bizagi.util.dateFormatter.formatDate(n,"dd hh:ss tt",bizagi.localization.getResource("datePickerRegional"))}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.time",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.time],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.parent",{},{init:function(n,t,i){var r=this;r._super(n,t,i);r.loadTemplates({"plan-parent-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.parent").concat("#project-plan-parent")})},renderContent:function(){var n=this,t=n.getTemplate("plan-parent-main");return n.content=t.render({}),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_SUMMARY_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n))},onNotifyLoadInfoSummaryPlan:function(n,t){var i=this,r=i.getContent().empty();i.params=$.extend(i.params,t.args);i.params.plan.parentWorkItem&&$.when(i.dataService.getPlanParent({idPlan:i.params.plan.id})).done(function(n){var t,u;if(i.params.plan.parent=n,i.params.plan.parent){t={idParent:i.params.plan.parent.radNumber,nameParent:i.params.plan.parent.displayName,idCase:i.params.plan.parent.idCase,idWorkflow:i.params.plan.parent.idWorkflow,idWorkItem:i.params.plan.parent.idWorkItem,idTask:i.params.plan.parent.idTask,processName:i.params.process?i.params.process:i.params.plan.parent.planName};r.empty();u=i.getTemplate("plan-parent-main");u.render(t).appendTo(r);$("#go-to-parent-case",r).on("click",$.proxy(i.onClickGoToParentCase,i))}}).fail(function(){})},onClickGoToParentCase:function(n){n.preventDefault();var t=this;t.routingExecute($(n.target).closest("#go-to-parent-case"))}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.parent",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.parent],!0);
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.users",{},{init:function(n,t,i){var r=this;r.usersMap={};r.plugins={};r._super(n,t,i);r.loadTemplates({"plan-users-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users"),"plan-users-tooltip":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users-tooltip")})},renderContent:function(){var n=this,t=n.getTemplate("plan-users-main");return n.content=t.render({}),n.content},postRender:function(){var n=this;n.sub("LOAD_INFO_ACTIVITIES_PLAN",$.proxy(n.onNotifyLoadInfoSummaryPlan,n))},onNotifyLoadInfoSummaryPlan:function(n,t){var i=this,o=t.args,f=[],r=[],s=i.getContent().empty(),u=bizagi.currentUser.idUser,e;i.params=$.extend(i.params,t.args);r.push({idUser:u,userType:["owner"]});i.usersMap["-"+u+"-"]={picture:"",id:u,name:"",userType:["owner"]};f.push(u);$.each(i.params.plan.activities,function(n,t){var e=parseInt(t.userAssigned,0);e===u?$.inArray("Assigned",r[0].userType)===-1&&(r[0].userType.push("Assigned"),i.usersMap["-"+u+"-"].userType.push("Assigned")):(i.usersMap["-"+e+"-"]={picture:"",id:e,name:"",userType:["Assigned"]},r.filter(function(n){return n.idUser==e}).length===0&&(r.push({idUser:e,userType:["Assigned"]}),f.push(e)))});i.params=o;e=i.getTemplate("plan-users-main");e.render({owner:r[0],assignee:r.slice(1),label:bizagi.localization.getResource("workportal-project-plan-assignee")}).appendTo(s);i.plugins.tooltip=i.initilizeTooltip();$.when(i.callGetDataUsers(f)).then(function(){i.renderUserProfilesAndImages()})},renderUserProfilesAndImages:function(){var n=this;$.each(n.usersMap,function(t,i){var r=$(".ui-bizagi-wp-userlist li[data-iduser="+i.id+"]",n.content);i.picture!==""?(r.find("img").prop("src",i.picture),$(".bz-wp-avatar-label",r).hide()):i.name?($(".bz-wp-avatar-img",r).hide(),$(".bz-wp-avatar-label",r).html(i.name.getInitials())):console.log("obj.name is undefined")})},callGetDataUsers:function(n){var t=this,i={},r=$.Deferred();return i={userIds:n.join(),width:50,height:50},$.when(t.dataService.getUsersData(i)).always(function(n){for(var i=0,u=n.length;i<u;i+=1)typeof n[i].name=="undefined"?bizagi.log(n[i]+" Id Not Found",n,"error"):t.usersMap["-"+n[i].id+"-"]?(t.usersMap["-"+n[i].id+"-"].picture+=n[i].picture?"data:image/png;base64,"+n[i].picture:"",t.usersMap["-"+n[i].id+"-"].name=n[i].name||""):console.log("self.usersMap['-' + response[i].id + '-'] is undefined");r.resolve()}),r.promise()},initilizeTooltip:function(){var n=this;return $(".ui-bizagi-wp-userlist",n.content).kendoTooltip({filter:"li[data-iduser]",content:$.proxy(n.renderUserTooltip,n),showOn:"mouseenter"}).data("kendoTooltip")},renderUserTooltip:function(n){var t=this,u=t.getTemplate("plan-users-tooltip"),i=n.target.data("iduser"),r=[];return r=i!==0?[t.usersMap["-"+i+"-"]]:$.map(t.usersMap,function(n){if(n.userType.join().indexOf("owner")===-1)return n}),u.render({users:r})}});bizagi.injector.register("bizagi.workportal.widgets.project.plan.users",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.users],!0);
