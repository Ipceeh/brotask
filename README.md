# ipceeh.github.io
task for brocoders
## update 24.05.18
added some beautiful changes - now it's a free space under the cursor while dragging
### drag-n-drop change:
* now puts element on free space
* on mouseup outside the table element returns back to its position
<br>
P.S. have a rare bug on 'stopFollowing' method, but can't even catch it by my will<br>
## update 23.05.18
fixed del-button disappearing, added comment to 'click' method, added drag-n-drop function
### drag-n-drop features
* on mouseup puts element before cell, which you are pointing
* on mouseup outside the table element returns back to its position
* on mouseup while pointing table (not it's children) puts element as a last child of the table
* recalculate indexes after dropping

## update 16.05.18
added Table class, deleted most id and listeners, left 4 buttons only (it caused animation change), some js refactoring, used prettier. HTML/CSS - tried to use BEM style
