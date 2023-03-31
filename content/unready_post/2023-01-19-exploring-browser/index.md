---
title: I rebuilt this blog
description: I tried more niche browsers.
date: 2023-01-19
tags:
  - software
  - school
hidden: true
hidden_reason: Maybe I should publish this soon, but browser are fast evolving things so I might need to redo this.
---
The story:
I tried to stay away from bloated modern browsers that's just a reskin of chromium, so I used Firefox, hated it, tried other browsers, hated it, made this blog post, then returned to chromium.

# It all started from Firefox
Over the past few month I've switched to Linux and most distros ships with Firefox.
I've decided to give Firefox another try and see how much it differs from my previous departure which is probably around **2 years ago**.

After around a month of using it, yes there are actually noticeable differences:
It now uses more memory, it has became noticably more aggressive about asking you to change to the default browser, and it got laggier!

Making a good browser is the best way to promote a healthy internet, unfortunately Firefox does not seems to deliver that.
Over the years, the browser is falling behind in the world of rapid changing web standards, does not deliver good performance and efficiency.

IMO the only thing where Firefox could stand out is only the browsing experience and privacy (Which not many people actually care about!) as they can't compete with the large ecosystem and integrations of other monopolies, but they just failed to achieve that with all new features hidden behind a flag, worse performance and higher system resources.  
It also means that technically Firefox is bottlenecking the modern web. If the web developer choose to support Firefox then they can't utilize newer web standards (Especially CSS features, such as :has). If they don't support Firefox then it will just result in the user having a worse experience, eventually moving on to other browsers.

As a user, I only want a browser that is fast, least resource hogging, and not having to deal with compat issues. Chromium is my answer, and Firefox isn't.

Sure there's cases where Firefox just works best on your system, can't break from your FF workflow, or you just have a Firefox exclusive extensions that you can't get rid of.  
These ARE valid reasons to continue using Firefox, but please don't use it for the sake of telling others you use Firefox, while telling yourself to dismiss all the problem it has.

_Don't use Firefox because it's not chromium, use Firefox because it works well for you._
In my case it doesn't work well, so I decided to look for something else!

# Epiphany / GNOME Web (Linux)
Epiphany/GNOME Web is a web browser that is based on the GTK port of WebKit, developed and maintained by GNOME.  

On first glance, the animation of the user interface is very smooth, with a familiar UI to Safari.
If you are a daily Safari user, this might give you familiarity.

Yeah... that is about it...

Epiphany doesn't really offer alot of customizations, if any. (As with other GNOME apps, could be a bad or good thing)

On top of that, not all website renders correctly, with some element being off-centered, Notably older forums and GitHub.
(I have actually checked Epiphany Technology Preview after this and it seems it's fixed, so at least we have that)

The memory usage skyrocketed to 5-6GB compared to others sitting at around ~3-4GB, which is the biggest memory hog across all the browsers I've tested.
Memory usage like this probably won't end up too well when I soon need to open another 20 tabs just to hunt 1 bug in my program.

I have high hopes that this will become my daily driver in the future before doing this test, but perhaps too high and ended up a bit disappointed.
It could just be my system, maybe with all these thing fixed it could be a viable alternative browser.

Another thing worth noting however is that progress on WebExtension is being made and "some" "simpler" extension such as [Dark Reader](https://addons.mozilla.org/en-US/firefox/addon/darkreader/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) does appear to work. Which in the future should hopefully help this browser's many shortcoming in terms of customizability and features.

(p.s. I don't have a host system that can run Safari so maybe I'll edit this post in 2077 when I bought a mac or something)

# Falkon (Win7+, Linux)
Falkon is a web browser developed by KDE that is based on the QtWebEngine (Which in turn, is still based around Chromium).

The memory usage is at around 3.0GB, while it's still lots of memory, it is "relatively" lightweight comparing to other modern browsers.
It just uses chromium underneath so there's not much to say performance wise.

Something related: This is also the first browser that has a reasonable amount of customization settings, yet still being able to find what am I looking for.

## The bad
First, Falkon is not a prominent browser. Some websites will make a whitelist of only allowing specific well-known browsers to enter the site, which is well, annoying.
Fortunately Falkon does allow you to change User-Agent out of the box, so it's not the end of the world.
Secondly, Falkon only has 17 third party extensions and 3 themes & without WebExtensions support. If you're the guy who have 800 extensions to do magical things then you'll find it a bit more disappointing.
Thirdly (And a dealbreaker for me), while it does come with an AdBlock extension, it failed to block YouTube ads. How devasating.
Of course I wouldn't mind so much to watch an ads once in a while, but YouTube is going insane with this and it's probably something I can't withstand (Even if it's not ethical to do so).
And finally, some site like reddit just doesn't work properly, I can't click on any button there.

## Overall
Falkon is certainly more capable than I thought, in fact I've used this for an entire day without noticing any major issue (Apart from adblock not blocking YT ads).

With that being said, I have heard that it's not very actively developed and it could cause problems browsing websites utilizing newer web standards. So it's probably a good idea to only install this on maybe your secondary laptop or something and all you want is to browse the web instead of doing something serious on it.

Other than that, Falkon could become a daily driver if you are willing to make some compromises to your browsing experience.
However it may not be ideal for less tech-savvy users, or people who can't afford the time to test and see what works and what doesn't.

# Pale moon
It's brings me back to around the Firefox ~40 era where the experience is not the best, but still not just outright crap.
It still support XUL-based Addons and NPAPI plugins, it doesn't hog lots of resources, and the experience is relatively smooth.
Memory-wise is very impressive, sitting at around 1.9-2.0GB.
Performance wise is slightly behind Chromium, but for the most part it is not too shabby.

Unfortunate when you pair it with the modern web, this is where things starts to crack down as it lacks a lot of modern web standards.
You will find graphical glitches here and there, with some website not working at all due to newer features of ES6.

However the lag can become very serious if you're loading a large amount of content (Whether it's the web page that has lots of content, or you're loading lots of tabs together), worse even the browser UI freezes which could result in a very bad user experience, and probably by far the biggest complaint.

If you want to browse the web on a very dated system (say you found a notebook back in the 2000s) with limited processing power, palemoon might be the way to go.

However I probably would not recommend running this on a modern system as most websites just doesn't work properly.
There are also some contriveries around the devs, but I don't think I am going to cover that as I don't have enough knowledge about it.

# Librewolf / Firedragon (Firefox derivatives)
These are customized version of Firefox with the focus of "privacy, security and freedom"
It technically doesn't fork the entire Firefox codebase but instead provides a set of patches and configuration.

It will then take Firefox's latest source code, patch it, build it and release the patched Firefox browser.
This will ensure that a new build of Firefox can be pushed as fast as possible. (Usually still a few days behind)

But other than that I don't think there's anything more to say, it's essentially just a "Hardened Firefox" that comes out of the box.
Interestingly on Librewolf I can see my memory usage halvened, and it does come bundled with several add-on, but it is still Firefox afterall and it just doesn't play well with my system.

But hey it could still be a choice if you value privacy but want something that you can use out of the box without messing here and there.

Note: Firedragon is a fork of Librewolf, Librewolf is a fork of Librefox.  
Librefox is not a browser but rather just a set of configuration files that is used to "patch" Firefox. [The original plan for Librefox is also to ship an pre-patched Firefox browser so user don't have to apply these patches themselves](https://github.com/intika/Librefox/issues/55), but the development halted before any of this could happen.
Librewolf then forked Librefox to continue maintaining these patches, and also building a full browser release with their own branding and patches.