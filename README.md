# Another Todo List
This is just meant to be a simple todo list app to keep me in practice and potentially get a useful tool out of. The inevitable feature creep will also be a good opportunity to learn some new things.
<br>

### Packaging with Electron
If all goes to plan, Electron will be used in order to package this web application into something usable on it's own. PySimpleGUI isn't supposed to be used "at work" and Java Swing makes me sad, so I'd mostly like to see how easy it is to create GUI-enabled applications without such tools. If this doesn't work how I'd like it to, I guess we're going back to Swing.
<br>

```mermaid
graph TB
L[/Plan features & layout/] ==> A
A(Initial development as web app) ==> B(Integrate Electron/Node.js)
B ==> C(Package standalone app w/ Electron)
C -.->|Everything is broken| A

A -.->|Bugfixes| A
B -.->|Bugfixes| B
```
