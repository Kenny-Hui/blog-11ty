---
title: High memory usage on Minecraft 1.18+

date: 2023-07-28
tags:
  - Minecraft-Server
  - Solution
---
I've recently updated a Minecraft Fabric server from 1.17.1 to 1.19.2, and it's shocking to see the memory shooting up all the way from 1.6GB to 4.8GB on start up, and that is in a 6GB server!  
It could only ever last for a few hours before running out of memory.

I should have rolled back to 1.17 at this point, but my stupidity still thinks that this is just a temporary side effect and 1.19 gets much better mod support than 1.17 so it shouldn't be a big problem in the long run, and I was proven wrong once again. I've tried everything I could and the server still keeps running out of memory, and now I desparately need to find a solution.

So later I found [Slumber](https://modrinth.com/mod/slumber) which stops the world from ticking when no one is online.  
This is usually more for self hosted environment as it can save resources, but it actually does slightly improves memory when no one is online.  
However it still does not solve the core issue that 1.19 is just using so much more memory than before.

That is until I was browsing through modrinth one day and found [ModernFix](https://modrinth.com/mod/modernfix), included in it is a patch that fixes chunkloading requiring a huge amount of memory.

{% image "./patch.png", "Plasma's Alternative Widget, with 2 options (Minimize all Windows/Show Desktop) " %}

I've actually heard of ModernFix before, but I've always thought it's only for Forge or something like that so I didn't look too deep (Perhaps I've mixed up with another mod), until I noticed it's also available for Fabric, so I gave it a shot and that nailed it, the memory are now back to normal (~2GB) :D