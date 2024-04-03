# Another Todo List
This is just meant to be a simple todo list app to keep me in practice and potentially get a useful tool out of it. The inevitable feature creep will also be a good opportunity to learn some new things.
<br>

### Packaging with Electron
If all goes to plan, Electron will be used in order to package this web application into something usable on it's own. PySimpleGUI isn't supposed to be used "at work" and Java Swing makes me sad, so I'd mostly like to see how easy it is to create GUI-enabled applications without such tools. If this doesn't work how I'd like it to, I guess we're going back to Swing.
<br>

```mermaid
graph TB
A(Initial development as web app) --Works--> B(Integrate Electron/Node.js)
A --Broke it--> C(Fix bugs)
C --Oh no --> C
C --Works--> B
B --Broke it again--> E(Fix Bugs)
E --Please help--> E
B --Works--> D(Package standalone app)
E --Works--> D
```
