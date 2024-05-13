---
title: Reverse Engineering an USB mouse
description: Clueless, a bit pointless, but fun!
tags:
  - software
  - reverse-engineering
date: 2024-05-13
---
Heh what a busy semester. Anyway ever since I've switched to Linux, I usually try to find alternative replacements for the software I use on Windows. It's not perfect but it gets me 90% there. (And with the right configuration it does feels more productive than Windows)

One thing that I cannot always find however is a replacement for vendor-provided software to control my peripherals.
Fortunately most of my peripheral device is extremely dumb. A keyboard is a keyboard, it types and does absolutely nothing more. The same cannot be said for my mouse though.

For some background, this is the current mouse I have, an **AOC GM110 "Gaming Mouse"** getting sold for roughly the same price or cheaper than an office mouse.

{% image "./gm110.jpg", "An AOC GM110 Gaming Mouse" %}  
<small>I know the picture quality sucks, this blog is a huge mess™</small>

It has a total of 7 buttons (Left/Middle/Right button, 2 side buttons and 2 in the middle), and it also has a RGB breathing light.

I bought this after my previous mouse, a **Philips SPK9505 "Gaming Mouse"** with the same configuration, starts to have all sort of click issues and stuff.

These 2 mouses are all sold at a reasonably cheap price for what is supposedly "more than an office mouse".

Now if you have never heard of these 2 mouse before, that is completely normal as:  
1. *Model number sucks and are never meant to be memorized by humans :)*
2. **These mice are not actually produced by either Philips nor AOC.** I am not sure of the inner workings, but from what I know these mice are manufactured somewhere (Probably Mainland China) for a good price, then the logos are just slapped onto the mouse after some approval or licensing fee or whatever.

Anyway these mouse ships with a mouse software that runs on the Microsoft® Windows® Operating System that allows you to configure your mouse.

This is the software that comes with my old Philips mouse:  
{% image "./m1.png", "Button rebinding page in the mouse software" %}
<small>Button binding page, where you can rebind mouse buttons to however you like</small>

<a id="macro-intro">
{% image "./m2.png", "Macro page in the mouse software, which allows you to input a sequence of timed key input command" %}  
</a>
<small>Macros page, which allows you to setup a sequence of key event that is triggered by a button<br>(Trigger is setup by binding the mouse to a macro in the Mouse Binding Page)</small>

{% image "./m3.png", "Advanced page in the mouse software" %}  
<small>Fire Speed, "Pointer Precision" *(Bad Translation; Should be Pointer Speed)*, Scroll Speed and DPI Setup w/ 4 DPI to choose from</small>

{% image "./m4.png", "LED Page in the mouse software, which allows you to configure the lighting of the mouse" %}  
<small>Breathing Light Setup, with Slow, Fast, Static and Off available as option.</small>

Why am I still talking about my old mouse and its software? Well that's because I can't find the software for the AOC GM110 that I am currently using. **But** I noticed that my old Philips-branded software still do work on my AOC GM110 mouse, every single option.  
This suggests that these 2 mouse is probably the same under the hood, just maybe with a different shell, branding and packaging.

Anyway it should be worth mentioning that I don't *need* the mouse software for my daily use.  
For the most part this little mouse already fulfills my daily need as a non-gamer, heck you can even rebind the 2 side button on Linux which is really handy.  
(At least on KDE, but I assume you can also do it on other platform as well).

{% image "./kde_rebind.png", "KDE Mouse Settings Window, allowing you to rebind extra buttons" %}

However that doesn't mean that I am not *at least a bit intrigued* by the extra functionalities that the mouse software provides, especially after seeing projects like [OpenRGB](https://openrgb.org) which does not rely on the Vendor's software.

Besides I miss the time when I just plays around and try new things, as opposed to me tiredlessly working on Minecraft mods that doesn't give me much satisfaction for the past 2 years or so. Perhaps I won't stick with that thing in the long term, but I had fun and I gained knowledge.  
With around a week of holiday before exam, this seems like a greats opportunity to do so.

My plan for this is that I don't really have a plan, other than hopefully making a program that can configure my mouse in Linux, and starting with absolutely *zero* knowledge on anything USB related!

My first step is to literally Google **How to reverse engineer a USB Mouse**, which led me to [this](https://bytepunk.wordpress.com/2017/03/25/reverse-engineering-a-usb-mouse/) and [this great blog post](https://zazama.de/blog/reverse-engineering-usb-rgb-devices-and-building-your-own-rgb-software-by-example-using-rust-and-glorious-model-o/), both have helped increase my understanding of the general work required to pull something like this off.

# Wireshark, save me!
The first thing I need is some sort of tools that can capture USB data so I can see what is actually being sent to the mouse *(Or well reverse-engineer the software itself, but I am not going there)*

Reading the aforementioned blog post, I am a bit surprised to find out that Wireshark can capture USB data as well, given that for the longest time I've only heard it being used in the context of networking.  
Originally I just throw it off as some sort of "hacks" that requires you to setup this and that to fake that it's a network interface or whatever, but no this is an officially supported use-case.  
In fact the Wireshark installer on Windows even asks you whether you want to install USBPCap which allows you to capture USB traffic:

{% image "./wireshark_usbpcap.png", "Wireshark Installer on Windows, asking whether you want to install USBPCap" %}  
<small>(Greyed out because I already have it installed)</small>

After that, the USBPCap entry just appears on the Wireshark Homescreen like magic!

{% image "./wireshark_home.png", "Wireshark Home Screen, presenting a list of interfaces that can be captured. USBPCap appeared there." %}

And now I have access to all the USB data under the sun, ha-ha!

{% image "./wireshark_spam.png", "Wireshark Window, with tons of USB Packets displayed" %}

...Okay that's a lot of traffic. The first thing I did is trying to filter out the massive amount of traffic getting displayed so I can actually focus on what matters.
I am no genius so I just moved my mouse and see which address it's coming from, and I just filtered that address, 1.2.1.

{% image "./wireshark_1.2.1.png", "Wireshark Window, with usb packets filtered to usb address 1.2.1" %}

But I quickly realized that's not the address I should be looking for. Sure it may have mouse traffic, but when I fired up my mouse software and hit "Apply", nothing seems to show up other than my mouse movement & my left click.

After a bit of fiddling and research, it turns out that a USB Devices have different so called **Interfaces** and **Endpoints**.  
To put it very simply (Again I am no expert in this!):
- **Interface** contains a group of endpoints which is dedicated for a specific use (Whether it would be a mouse, or a keyboard).  
- **Endpoint** are... well you can think of it as a place where data goes in and out.
All USB device *must* have at least 1 Endpoint in Address number 0 (Endpoint 0) used for control transfer. This is the endpoint that is used to communicate and configure your USB device by the OS.

In this case it appears that the mouse software also send the config to the mouse on Endpoint 0, so I changed my wireshark filter to `1.2.0` instead to inspect data coming from/to that endpoint instead.

After I hit the "Apply" button on my mouse software again, 14 new entry appeared:

{% image "./wireshark_on_apply.png", "Wireshark Window, with a list of usb packets appearing after clicking the Apply button in the mouse software" %}

OwO let's inspect it :P

# Observation
This is probably the most nerdiest part, to figure out and guess what each of the packet does and how is the data formatted.

Now I don't know a lot about reverse-engineering, but I know that a good starting point is to change 1 option in the software, apply it again, then compare it with the previous data sent and figure out the difference, so here are my (initial) observations:

## Button Bindings
This mouse have the capabilities to rebind buttons, either to another button or an action like changing the DPI, opening a calculator or performing shortcuts.

<a id="button-bindings">
{% image "./mouse_binding_menus.png", "Button binding page, allowing you to not only rebind buttons, but also perform Shortcuts and perform Multimedia key input" %}
</a>

For simplicity sake I'll just call all of these **action** (i.e. A **Left Mouse Button** is binded to a **Left Button/Left Click action**)

So I started changing the bindings to see what got changed from which packets (Remember it sends 14 of them all at once on apply!), and it seems that for Mouse Bindings, the data is sent in the following format (7 times for each of the 7 buttons on the mouse):
```
07 10 BT AT 00 00 00 00
      ^^ ^^
```

**BT** is the physical button that is to be rebinded:
<table>
  <tr>
    <th>Value</th>
    <th>Button Name</th>
  </tr>
  <tr>
    <td>01</td><td>Left Mouse Button</td>
  </tr>
  <tr>
    <td>02</td><td>Right Mouse Button</td>
  </tr>
  <tr>
    <td>03</td><td>Middle Mouse Button</td>
  </tr>
  <tr>
    <td>04</td><td>Side Forward (Towards front)</td>
  </tr>
  <tr>
    <td>05</td><td>Side Backward (Towards user)</td>
  </tr>
  <tr>
    <td>06</td><td>Middle backward (Towards user)</td>
  </tr>
  <tr>
    <td>08</td><td>Middle forward (Towards front)</td>
  </tr>
</table>

**AT** is the rebinded action:
<table>
  <tr>
    <th>Value</th>
    <th>Action Name</th>
  </tr>
  <tr>
    <td>00</td><td>Software action...?</td>
  </tr>
  <tr>
    <td>01</td><td>Left Button</td>
  </tr>
  <tr>
    <td>02</td><td>Middle Button</td>
  </tr>
  <tr>
    <td>03</td><td>Right Button</td>
  </tr>
  <tr>
    <td>04</td><td>Back</td>
  </tr>
  <tr>
    <td>05</td><td>Forward</td>
  </tr>
  <tr>
    <td>06</td><td>DPI Cycle</td>
  </tr>
  <tr>
    <td>07</td><td>Show Desktop</td>
  </tr>
  <tr>
    <td>08</td><td>Double Click</td>
  </tr>
  <tr>
    <td>09</td><td>Fire</td>
  </tr>
  <tr>
    <td>0a</td><td>DPI+</td>
  </tr>
  <tr>
    <td>0b</td><td>DPI-</td>
  </tr>
</table>

So for example, binding the **Left Mouse Button** to a **Right Button action** would look like:
```
07 10 01 03 00 00 00 00
      ^^ ^^
```

Also worth noting is the `00` in **AT**. It seems that when choosing any actions within the [ShortCut / Media submenu](#button-bindings) (Copy/Pasting, Calculator, Play/Pause), **AT** is always reported as `00`.  
There's no follow up data either, *which means that the mouse would have no idea which specific action is actually binded*?

For now I will call `00` as **Software action**. Since the mouse have no knowledge of the action, my guesses are that it most likely relies on some interference from the mouse software.

## Something...?
It seems that on apply, there's always this one report that is always getting sent by the mouse software and the value never changes:
```
07 11 00 00 00 00 00 00
```

Without anything I can change in the software that affects the values, I really have no idea what this data means. I can only assume this is unused for now.

## Fire Speed
{% image "./fire_speed.png", "Fire Speed Slider in the mouse software" %}

There's a **Fire Speed** slider in my mouse software. Now since I don't use 90% of the mouse features I have no idea what this means, other than that it's a slider going from 8-300 :)

Data sent:
```
07 12 00 FR 00 00 00 00
         ^^
```

**FR** appears to be a value between **00** and **1F**.  
Interestingly it seems to be **in +16 increments and rounded down**. (So if the Slider reads 15 in the software, it gets sent as `00`, if it's 16 it gets sent as `01`), even though the software itself makes it look like you can set an arbitrary value.

I guess I did get what I paid for...

## RGB Lights
This mouse comes with RGB lights (Or more appropriately named, Breathing Light), which would cycle between **Blue, Magenta, Red and Purple** color.

You can choose between 4 modes in the software: **Slow, Fast, Static and Off**

{% image "./rgb_options.png", "Slow, Fast, Static and Off option presented in the LED page of the mouse software" %}

Now let's see what is sent:
```
07 13 7f CF 00 00 00 00
         ^^
```

**CF** is the RGB Configuration:  
<small>(The "seconds" below represents the time the mouse stayed in 1 color before cycling to the next one)</small>

<table>
  <tr>
    <th>Value</th>
    <th>RGB Mode</th>
  </tr>
  <tr>
    <td>10</td><td>Slow (6s)</td>
  </tr>
  <tr>
    <td>13</td><td>Fast (3s)</td>
  </tr>
  <tr>
    <td>16</td><td>Static</td>
  </tr>
  <tr>
    <td>17</td><td>Off</td>
  </tr>
</table>

## DPI Configuration
There are a total of 4 DPI profiles available for this Mouse.

Each profile has it's own configurable DPI value, and can be set as "active" either by pressing mouse buttons binded to a DPI-related action, or by simply clicking the **DPI 1/2/3/4** on the software.

{% image "./dpi_profiles.png", "Advanced page in the mouse software, allowing you to choose different DPI Profile" %}

4 reports gets sent to the mouse, with each representing one of the 4 DPI profiles:
```
07 09 AD DP 0f 00 00 00
      ^^ ^^
```

**AD** is the currently active DPI Profile (00 - 03)  
**DP** is the DPI Configuration for the profile, where:
- The left 4 bits is the DPI value from 1-f
- The right 4 bits is the DPI profile (8-b for 4 profiles in order)

So **DP** would be:
<table>
  <tr>
    <td>18-f8</td><td>DPI for DPI 1</td>
  </tr>
  <tr>
    <td>19-f9</td><td>DPI for DPI 2</td>
  </tr>
  <tr>
    <td>1a-fa</td><td>DPI for DPI 3</td>
  </tr>
  <tr>
    <td>1b-fb</td><td>DPI for DPI 4</td>
  </tr>
</table>

## An Imposter...

Out of everything I've changed, it seems that there's 2 options that doesn't change anything sent when clicking the "Apply" button:

{% image "./imposter.png", "Advanced page in the mouse software, with a Pointer precision slider and a wheel speed slider" %}

Initially I thought that there may be some other way it's communicating with the device that I have not discovered yet, and maybe it's going to another rabbit hole?  
But then I have an idea. I opened up the Start Menu, typed "Mouse Settings", and well there it is!

{% image "./windows_pointer_speed.png", "The Pointer precision slider in the mouse software and Windows mouse pointer speed settings side by side, showing that they match" %}

{% image "./windows_wheel_speed.png", "The wheel speed slider in the mouse software and Windows scroll wheel settings side by side, showing that they match, but the mouse software always underrepresented the value by 1" %}  
<small>*Looks like someone forgot 0-based index :)*</small>

# Writing the implementation
Now that I have everything I need (Or at least I thought so...), it's time to start writing an application in Linux that can control my mouse!

Given that both my Philips and my AOC mouse can be used interchangably with the same vendor-provided software, it also suggests that my implementation can potentially be used by dozens of other same generation of mouses that are simply just released under a different brand and shell.
As such I want it to have a reasonable GUI interface rather than something that is hacked together only for my use, and ideally it should be as user-friendly and as painless as possible.

Initially I am plan to write this in Python as it's usually already bundled by most Linux distributions. I have came across a [Python hidapi library](https://pypi.org/project/hidapi/), which is a wrapper to the [C hidapi library](https://github.com/libusb/hidapi). However my experience with Python has been *really* limited and even for smaller scripts I've made, I just don't feel like it's my thing. So after some delibration I decided to just use the C hidapi library, as the example provided in the README seems reasonable enough to use.

I have also considered just using [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API) and make a webpage out of it so you can literally configure it in a web browser. However when I start to factor in the fact that:
- The mouse does not store settings persistently (So every reboot it resets the config)
- Firefox doesn't support WebHID API (For better or for worse)
- - I primarily use Firefox
- - Most Linux Distributions only ships Firefox out of the box
- The possibility that I may need a persistently running daemon for more advanced feature I may discover later <small>(Spoiler: I do ended up needing it)</small>

Yeah that seems rough... let's just make a traditional desktop application lmao.

With that out of the way, I started working a prototype in C based on the hidapi example code.
After a bit of back and fourth, just pretty much "blindly" filling everything from Wireshark, I managed to change my RGB Light configuration on my mouse, exciting stuff!

{% image "./prototype1.png", "A code editor showing my C prototype implementation" %}
<small>*Note: You may need to run the program as root (sudo), or [make a udev rules](https://github.com/libusb/hidapi/blob/master/udev/69-hid.rules) that permits user access to the device*</small>

{% image "./rgb_off.png", "My mouse's light being turned off" %}  
<small>it off!</small>

Now for the GUI. As I've said I don't want to touch python, so I decided to use Qt Widgets (C++) as it does seems to offer a GUI Editor (.ui files), and Qt in general as it seems to offer a lot of abstractions so hopefully I don't have to shoot myself into the foot.  
<small>*Gosh I need to thank my C++ teacher last semester.*</small>

As someone who have never touched Qt Widget before, it somewhat reminded me of WinForms. It's quick and a bit messy, doesn't have that much of a structure or hierarchy, but it's stupidly simple to get started.

{% image "qtwidget.png", "Qt Creator showing C++ code with repetitive functions and my newly written program side by side" %}

## The unanswered
As I was working through making the DPI Page in my program, I came across multiple questions I have not thought of yet:
1. How is the software suppose to keep in sync with the mouse configuration? Does it read the value from the mouse on startup?
2. What does the DPI value actually reads on each tick in the slider of the software? I know it's a value from 1-f, but I need a readable DPI value for the users.

For the 1st question, I booted back into Windows, launched Wireshark and started monitoring, then started up the mouse software.  
As it turns out, instead of ensuring the software is in-sync with the mouse, it ensures the mouse is in-sync with the software by applying the software's config to the mouse on startup.  
Well fair enough I guess.

For the 2nd question, I started taking notes of the value for each tick in the DPI Slider.  
However I can't help but notice that the DPI Slider only have a total of 12 ticks, but there should be 16 different values I can send.

{% image "dpi_sliders.png", "The DPI Slider in the mouse software, with 12 slider overlay showing the possible value that the slider can be dragged onto" %}

Then what do they do with the rest of the 4 values, are some of them just skipped over?  
Apparently yes, let's look at the DPI values reported by the software:

<table>
  <tr>
    <th>Value</th>
    <th>User-facing value</th>
    <th>Increments</th>
  </tr>
  <tr>
    <td>1</td><td>200</td><td>-</td>
  </tr>
  <tr>
    <td>2</td><td>400</td><td>+200</td>
  </tr>
  <tr>
    <td>3</td><td>600</td><td>+200</td>
  </tr>
  <tr>
    <td>4</td><td>800</td><td>+200</td>
  </tr>
  <tr>
    <td>5</td><td>1000</td><td>+200</td>
  </tr>
  <tr>
    <td>6</td><td>1200</td><td>+200</td>
  </tr>
  <tr>
    <td>8</td><td>1600</td><td>+400 (Skipped)</td>
  </tr>
  <tr>
    <td>a</td><td>2000</td><td>+400 (Skipped)</td>
  </tr>
  <tr>
    <td>c</td><td>2400</td><td>+400 (Skipped)</td>
  </tr>
  <tr>
    <td>d</td><td>3200</td><td><strong>+800</strong></td>
  </tr>
  <tr>
    <td>e</td><td>4000</td><td><strong>+800</strong></td>
  </tr>
  <tr>
    <td>f</td><td>4800</td><td><strong>+800</strong></td>
  </tr>
</table>
<small>(Values that are not covered by the chart is the value skipped over by the slider)</small>

The value from 1-c seems to be consistent with a +200 incrementation on each value bump. After that however it increments by +800 for each value.  
I am no expert but this seems a bit arbitrary and I am having a hard time believing that these values are really reported as is.

I've decided to just stick with a consistent +200 incrementation for my program (So the DPI Range would be displayed as 200 - 3000) as it seems to make the most sense at the moment.

{% image "dpi_200_inc.png", "My mouse program, showing the DPI Page with 4 DPI profile to choose from, and a slider ranging between 200 - 3000" %}

### I didn't know enough about the software, apparently
While looking through the DPI Page in the mouse software, I've also discovered that these little Blue Square is actually checkboxes that can be turned on and off!

{% image "dpi_checkboxes.png", "The provided mouse software, there's a blue square on the top of each DPI selection that is actually a checkbox" %}  

Once disabled, the mouse will simply skip over the DPI value when changing the DPI.  
<small>*Well who would have thought this is clickable? It's not like the colored circle below is clickable either!*</small>

Anyway let's see what happens if I turn off the 1st DPI Profile:

{% image "wireshark_dpi_dump.png", "Wireshark packet, highlighting the data '07 09 AD DC 0e 00 00 00'" %}

And compare it with our previous DPI observation:
```
07 09 AD DC 0f 00 00 00
            ^^
```

Hmm so it seems that the `0f` is not a static value after all and represents which DPI is enabled or not. But how exactly are they represented?  
The number seems a bit random at first, especially when there are so many on/off combinations you can make, but soon it became clear:
{% set section = { header: 'Computer 101', content: '
For the uninitiated, a byte is consisted of 8 bit (1111 1111), where each bit can either be a 0 (off) or 1 (on).
Conveniently a byte can be represented by 2 hexadecimal number. That is because each hexadecimal number is used to represent 4 bits (1111). The total combination of all these 4 bits being on/off is (4² = 16), which can fit exactly to one hexadecimal as a hex have 16 possible values.
' } %}

{% include "section.njk" %}

It seems that only the rightmost 4 bits is used to represent the enabled DPI profiles, where the 4 bits corresponds to the 4 DPI profiles for this mouse, each with an on (1) and off (0) state: `1111`

So if the first profile is disabled, it would be `1110`, converting it to hexadecimal and then you get `e`.

{% image "dpi_enable_toggle.png", "The DPI Page in my program, now with Enabled checkboxes" %}  
<small>Now with DPI Checkboxes! I do wonder how much people use it though</small>

### The "Fire Speed"
It seems that the **Fire Speed** slider is related to the **Fire** button that is bindable in the mouse binding page, wow who would've thought!

{% image "fire_button_binding.png", "Button binding page in the mouse software, allowing a button to be binded to an action called 'Fire'" %}

{% image "fire_speed.png", "The Fire Speed slider, which corresponds to the Fire action." %}

When the **Fire** button is held down, it essentially acts like an auto-clicker where it will spam the left-click according to the Fire Speed.

The **lower** the fire speed is, the **faster** it clicks, starting with **8** which clicks at a rate of **8ms**. The highest I can set in the software is **300**, which clicks at a rate of... **150**ms? I am truly starting to develop trust issues with this software...

But still even with the slider maxed, the value only goes up to `1F`, surely it doesn't max out at that right?

So I went back to Linux and added a slider in my application that goes from 0-255 (`00-FF`) and fed that to the mouse.
With the maximum value (FF), it seems that it can fire as low as every 2s, and it's merely not exposed by the vendor software, *now I am starting to feel like I am getting something out of all of this!*

## Syncing the active DPI Profile with the UI
As mentioned earlier, the software syncs its config to the mouse on startup, so the UI in the software should in-theory always be aligned with the mouse's state.

Now this *would be* true if the software is the only one being able to change the mouse configuration. But remember how you can bind your mouse button to change the DPI? This means that you can change the active DPI by pressing a mouse button, bypassing the software entirely.
As such I constantly find my program showing the wrong active DPI profile when playing around.

So I went back to Windows and check how the mouse software would handle this:

<video controls src="/img/2024-05-15/dpi_sync_win.mp4" type="video/mp4"></video>

So it appears that the software *does know* when the DPI got changed as it would reflect the new active DPI profile in real-time. This suggests that the software is also actively monitoring the device, probably for some sort of button press, or maybe the mouse would send DPI change report to the Host?

### A second interface
I went back to Wireshark, filtered the input endpoint (1.2.1) and clicked on my DPI+ button, expecting something to come up from the mouse... But nothing?
I mean I can clearly see stuff coming through when I click my Left/Middle/Right Mouse Button and even my side button, is the DPI button just special?  
I was puzzled, and I left it there and went to sleep.

The next day I booted back to Windows for further digging. I fired up wireshark again, except this time the filter got cleared and I didn't bother re-applying the filter I previously had.

{% image "wireshark_no_filter.png", "Wireshark window, but I didn't apply a filter" %}

I clicked the DPI+ button again, and suddenly I see data sent from an address I have never seen before: **1.2.2**

{% image "wireshark_1.2.2.png", "Wireshark window with bunch of USB Packet, with a highlighted packet from usb address 1.2.2" %}

It turns out that 1.2.2 is Endpoint No. 2, which belongs to another USB Interface (Interface 1). It seems to be used for reporting... some sort of "special" button press from the mouse? Anyway let's take a look at the data first, which is 3 byte long:
```
Button pressed: 06 f6 01
Button released: 06 f6 80
```

After trying the DPI+ button, I tried the DPI- button:
```
Button pressed: 06 f8 00
Button released: 06 f8 80
```

Eventually I ended up with the following conclusion:
```
06 BT DP
   ^^ ^^
```

**BT** is the physical button pressed (Not the binded action):
<table>
  <tr>
    <th>Value</th>
    <th>Button Name</th>
  </tr>
  <tr>
    <td>f1</td><td>Left Mouse Button</td>
  </tr>
  <tr>
    <td>f2</td><td>Middle Mouse Button</td>
  </tr>
  <tr>
    <td>f3</td><td>Right Mouse Button</td>
  </tr>
  <tr>
    <td>f4</td><td>Side Backward (Towards user)</td>
  </tr>
  <tr>
    <td>f5</td><td>Side Forward (Towards front)</td>
  </tr>
  <tr>
    <td>f6</td><td>Middle backward (Towards user)</td>
  </tr>
  <tr>
    <td>f8</td><td>Middle forward (Towards front)</td>
</table>

**DP** is the DPI profile that should be active (00-03)  
Or **80** if the button is released. (I assume 80 is only to indicate the button is released & is not related to DPI)

So what likely is the case is that the program monitors incoming data from this endpoint, and updates the active DPI accordingly to **DP** reported by the mouse.

What I ended up doing in my program is to spin up another thread to monitor Interface 1 for "in-coming" data like this, then pass the data off to the UI and let it change the selected DPI.

<a id="dpi_input_handler">
{% image "input_handler_thread.png", "My program's implementation for monitoring incoming input" %}
</a>

Again this feels like one of those very minor "QOL" features, like it's not the end of the world if the UI doesn't update, which I do agree at that time as well. However this will end up laying the ground-work for some other features which I am yet to discover at this point.

## Hidden In Plain Sight
After figuring all of that out, I am determined to get one last thing working: The **Software action** bindings.

So I booted back into Windows. Before launching the program however, my mouse just managed to hovered long enough on the program to reveal the description of the executable:

{% image "a704f_tooltips.png", "Windows Desktop, hovering the program icon revealing a tooltips" %}

It literally translates into "Instant A704F Gaming Mouse"  
I have never heard of that before, so I decided to look it up:

{% image "a704f.png", "Instant A704F Gaming Mouse SOC Datasheet" %}

Turns out A704F is a gaming mouse SoC (System on a chip) from a Chinese company called Instant Microelectronics, *well that would have been useful to know like at the very start!*

This PDF did at least confirm some the behaviours I am seeing, but well I am not a hardware guy. (*And if you are, [here is the PDF](https://instant-sys.com/uploads/pdf/norm/SPEC/A704F_SPEC_EN.V1.00.pdf)*)  
Besides, it doesn't mention anything about how the software works, as obviously you are suppose to obtain the software from them as well, then customize the user interface to your need (Which the software allows you to do via .ini files) and sell the mouse as it's own product, so it's not particularly helpful either.

But hey! At least now I know how to call my program now other than possibly  
<small>"Mouse utilities for AOC GM110 & Philips SPK9505 and maybe other mouse who knows!"</small>

<a id="vendor-scroll-wheel">Oh I've also found a Instant A704 "Driver Manual", which documents the software usage, along with images of their mouse software which has a different UI than mine, but more or less offers the same options, except this "Scroll Wheel Configuration" that allows you to use your mouse scroll wheel to either scroll *or* change the sound volume:</a>

{% image "scroll_wheel.png", "Instant A704 Driver Manual, which featured a different UI, with the option to use your mouse wheel to scroll or to control the sound volume" %}

The Philips software I have did not offer those options, although I am not surprised if they just hid the option all together as their target audience is probably not some DJ :)

## Back to "Software action"
For a quick recap, when I say "Software action" I meant these:

{% image "mouse_binding_menus.png", "Button binding page, allowing you to not only rebind buttons, but also perform Shortcuts and perform Multimedia key input" %}

For these menus, `00` is sent as the binding to the mouse, and no other data is sent. So the mouse should not know about which specific function the button is binded to other than "it's a software-related action".
So in-theory only the software would know it and be able to perform the corresponding action.

To confirm that, I binded my Middle Forward Button to **Media > Calculator**. I then closed the software, and sure enough it no longer opens Calculator. These functions do rely on the software to be active.

Now remember how the mouse sends data about "Button Press/Release" for buttons with DPI action so as to update the DPI User Interface? It seems that the mouse also does the same when the action is set to `00`!

{% image "./soft_action_dpi_click_nosoft.png", "Wireshark USB Packet listing. First packet is the Mouse reported that the button is pressed. Second packet is the Mouse reported that the button is released" %}  
I've decided to start the mouse software again just to see if there's any difference, and yup!  
{% image "soft_action_dpi_click.png", "Wireshark USB Packet listing. First packet is the Mouse reported that the button is pressed. There's 2 more usb packets in between, and the last packet is the Mouse reported that the button is released" %}  
It seems there are now 2 more reports by the mouse in between:

```
02 92 01
02 00 00
```

After further digging, it seems they are in the following pattern:
```
02 KY KY
```
**KY** is the multimedia key held (Calculator in this case) configured in the software, and `00` represents that the key is no longer held.

Observation so far:
- "Software action" is reliant on the software being active.
- The mouse report to the Host when a button that is binded to either DPI or Software Actions has been clicked.
- The mouse itself should not have knowledge about which specific software action to perform, as it was never sent in the config.
- And yet the mouse itself sends the appropriate multimedia key back to the system

So I did some further digging on different endpoints.  
As it turns out the host sends a report back to the mouse in Endpoint 0 (The same one used to apply configuration to the mouse), likely commanding the mouse to do some sort of input, then the mouse makes the input to the system.

So to sum it up:  
- If a button is binded to a Software/DPI-related action, the mouse will report to the Host about the button pressed and the currently active DPI.
- The software monitors the incoming button press from the mouse (See Above):
- - In order to keep the Software UI in sync with the Active DPI
- - To command the mouse to input keys by looking up the specific action binded for this button

{% image "wireshark_kb_call_procedure.png", "Wireshark usb packet listing. First packet is 'Mouse report button pressed to host', Second packet is 'Host commands mouse to send function key', Third Packet is 'Mouse report function key is pressed to host', Fourth packet is 'Mouse report function key is released to host', fifth and final packet is 'Mouse report button released to host'" %}

This is also when I realized that what the 2 interfaces of the Mouse is all about:
- The first interface reports itself as a **HID-Complaint Mouse**, which is expected as it's a mouse.
- The other interface (Where the Software action and blablabla is sent) reports itself as a **HID-Keyboard**.

This now makes much more sense. The so called "Software action" should be more appropriately called "Key Input action" as it's likely just the mouse sending key input to the host, acting as a keyboard.

Perhaps I should've done more research and look into my mouse before starting all of this, but no :)

Anyway now let's take a look at what's actually being sent for the mouse to perform the input:
```
07 17 00 ea = Music Vol -
07 17 00 e9 = Music Vol +
07 17 02 23 = Browser
07 17 01 83 = Media Player
07 17 01 8a = Mail Manager
07 17 00 b6 = Last Chapter
07 17 00 b5 = Next Chapter
07 17 00 e2 = Mute Vol
07 17 00 cd = Play/Pause
07 17 01 92 = Open Calculator
```

Keep in mind that this is sent on Endpoint 0 (The same one used for configuring and applying mouse settings), and it doesn't feel all that different from sending a regular mouse config at all.

The 2nd byte is `17`, which I assume is to tell the mouse that this is a software key command.  
Then next 2 bytes appears to be... some sort of key code I guess. I didn't really look further as this list seems to be enough :P

But it's not over. Apart from the **Media** menu (Which inputs multimedia key), there's also a **ShortCut** menu:

{% image "shortcut_menu.png", "Button binding page from the mouse software, with a Shortcut submenu that offers actions like Copy/Paste" %}

*I don't know about you, but something suggest that it probably has to do with inputting Keyboard Shortcut.* And assuming that is the case, the mouse would probably have inputted **Ctrl+C** if I binded it to "Copy", so let's start with Copy.

This time the software sent 6 reports to the mouse:

```
07 15 e0 00 00 00 00 00
07 15 e0 06 00 00 00 00
07 15 e0 00 00 00 00 00
07 15 00 00 00 00 00 00

07 16 00 ff 00 00 00 00
07 15 00 00 00 00 00 00
```

Now let's try pasting (Ctrl+V):
```
07 15 e0 00 00 00 00 00
07 15 e0 19 00 00 00 00
07 15 e0 00 00 00 00 00
07 15 00 00 00 00 00 00

07 16 00 ff 00 00 00 00
07 15 00 00 00 00 00 00
```

After trying some other shortcuts, my best guess would be that:
- The **2nd** byte (`15`) is to command the mouse to make a regular keyboard input, just like `17` is to command multimedia key input.
- The **3rd** byte (`e0`) is for the key modifier (Probably **Ctrl**)
- The **4th** byte (`06/19`) is some sort of keycode that represents the key (Probably **C or V**)
- Each of the report is indicating all the keys that should be pressed.
(So the sequence would be `Ctrl -> Ctrl+V -> Ctrl -> None`)

I am not sure what the `07 16 00 ff` is for, maybe it's to prevent some sort of key jamming? Either way I never ended up figuring it out :P

Okay so being able to Copy and Paste is cool and all, but if we can figure out which keycode corresponds to which key, then we can allow user to bind any key-shortcut as they like.  
But how can we figure that out? I mean there's only a handful of shortcuts provided by the software that we can toy around with. Maybe at best we can make a LinkedIn shortcut (`Ctrl+Shift+Win+Alt+L`), but that's cumbersome to press!

### Macros!
If your brain has not exploded yet like me writing this blog post, you might have noticed that I never talked about the "Macros" feature after [listing it out in the beginning](#macro-intro). That's because it is not a feature I use nor do I care about it, and it's also beyond the scope of this project.

However since we are looking around keyboard input for now, playing around with macros might not be a bad idea.
After all Macro also just a series of keyboard inputs, maybe we will have some hope there? So I setup a macro in the software and triggered it.

As I have hoped, it behaves exactly the same as those in the Shortcuts menu, just that it now returns the key that I get to define!  
So now I can press almost every indiviual key on my keyboard and get the value of it.

Oh and I also realized that there is actually no separate byte for a Key Modifier and a Regular Key.  
In-fact all 6 bytes after the initial `15` is just a keycode. You can hold down a maximum of 6 keys at a time and it would fill all 6 bytes:

```
07 15 KY KY KY KY KY KY
      ^^ ^^ ^^ ^^ ^^ ^^
```
**KY** is the keycode.

After pressing a good amount of key and noting down the keycode, I just cannot ever imagine that the manufacturer would make their own set of keycode. So I looked up online to see if there's any key code with some similarities, and well it's literally just the [HID Keyboard scan code](https://gist.github.com/MightyPork/6da26e382a7ad91b5496ee55fdc73db2).

## Back to implementation
With this information and filled with excitement, I went back to Linux and modified the prototype to start sending the input to the mouse, first by trying to input the Win/Meta key.

{% image "./key_first_attempt.png", "Linux Terminal, showing me run my prototype program" %}  
Nothing.  
I tried it again, still nothing.

At this point I become a bit fustrated, could it be some differing implementation between Windows and Linux? Is there anything I overlooked? I even booted back to Windows to make sure I am not doing anything wrong, but nothing seems off.  
I went back to Linux, ran it again and then it just worked??? But then sometimes it doesn't, it's like a 50/50, which is very odd.

At one point I removed the final report that would release all keys (`07 15 00 00 ..`) as an attempt to debug, which ended up working and my Win/Meta key is now held without releasing.

Hmm so it clearly seems to work. As I try to focus back to my terminal and press Ctrl+C to terminate the program... oh no this can't be... no No!!!  
<small>*(I binded my Win/Meta key to "Drag Windows", so I can't focus on any Window or anything as long as it's held down)*</small>

Anyway after a Hard Reset of my computer, my takeaway is that it may not be a good idea to leave a key held forever!

After some further digging, I found out that that the whole time it's because I run my program in the terminal, and naturally I pressed **Enter** on my keyboard to run it.  
By the time the program has executed and the key command is sent to the mouse, if my reaction is slow enough I might not have released the Enter key yet, it will end up blocking the Win/Meta key input by the mouse, as such I didn't notice any effect. Well that's clearly a lot of fun to figure out!

Adding a short delay before running the program (So I have time to release my enter key) fixes the issue, and practically speaking it is very unlikely such event will happen as you can only trigger the action by a mouse anyway.

Now back to my program. Since [earlier I've already made a monitor thread](#dpi_input_handler) to sync the active DPI, I can now just extend that to handle software key as well.

{% image "./new_thread_code.png", "My linux mouse program, with new codes inserted to the DPI monitoring code I wrote earlier" %}

# The Untold
My own program can be considered mostly finished, with the exception of fully-featured Macros which I didn't bother implementing as it was never the scope of the project. (Doesn't interest me enough :P)

As one last act, I decided to fiddle around a bit with different config values sent to the mouse, those that was not exposed nor sent by the vendor software.
(Spoiler: It's nothing mind-blowing, but still nice to know)

## RGB light goes brrrr
Remember how we can set 4 different configuration for the RGB Light?
<table>
  <tr>
    <th>Value</th>
    <th>RGB Mode</th>
  </tr>
  <tr>
    <td>10</td><td>Slow (6s)</td>
  </tr>
  <tr>
    <td>13</td><td>Fast (3s)</td>
  </tr>
  <tr>
    <td>16</td><td>Static</td>
  </tr>
  <tr>
    <td>17</td><td>Off</td>
  </tr>
</table>

I decided to try the value in between, and the result is... well the speed in between.
<table>
  <tr>
    <th>Value</th>
    <th>RGB Mode</th>
  </tr>
  <tr>
    <td>10</td><td>Slow (6s)</td>
  </tr>
  <tr>
    <td><strong>11</strong></td><td><strong>Slower (5s)</strong></td>
  </tr>
  <tr>
    <td><strong>12</strong></td><td><strong>Slightly Slower (4s)</strong></td>
  </tr>
  <tr>
    <td>13</td><td>Fast (3s)</td>
  </tr>
  <tr>
    <td><strong>14</strong></td><td><strong>Faster (2s)</strong></td>
  </tr>
  <tr>
    <td><strong>15</strong></td><td><strong>Very Fast (1s)</strong></td>
  </tr>
  <tr>
    <td>16</td><td>Static</td>
  </tr>
  <tr>
    <td>17</td><td>Off</td>
  </tr>
</table>

Here's how it looks with `15` btw:

<video controls src="/img/rgb_vfast.mp4" type="video/mp4"></video>  
<small>Okay it may not look very fast, but trust me it's definitely way faster than I can ever set it to in the official software!</small>

I've also added the "Very Fast" option in the GUI as it seems cool:

{% image "rgb_tab_vfast.png", "My linux mouse program's RGB Page, showing a new 'Very Fast' radio option that can be selected" %}

## Utilizing scroll wheel to its fullest
Remember earlier when the mouse software always sends this to the mouse on apply?
```
07 11 00 00 00 00 00 00
```

I just thrown it off as some unused feature, but out of curiosity I decided to mess with it anyway. Maybe with enough luck I can change some minor behaviour of the mouse?

First, let's try `01` on the 3rd byte:
```
07 11 01 00 00 00 00 00
      ^^
```
Now my scroll wheel is used to control my sound volume instead of scrolling!  
{% image "vol.png", "Sound volume got changed" %}

This is inline with what I [observed earlier](#vendor-scroll-wheel) about there being an option to change your scroll wheel to control volume as well.

Now let's try `02`:
```
07 11 02 00 00 00 00 00
      ^^
```

This seems to disable the scroll wheel all-together, rendering it ineffective.

`03` is also the same, after that the cycle just repeats.

### What about the 4th byte
Out of curiosity I also decided to mess around with the 4th byte, starting off with `01`:
```
07 11 00 01 00 00 00 00
         ^^
```
This does not appear to do anything at first, *however* if I change the 3rd byte to `02` like so:
```
07 11 02 01 00 00 00 00
      ^^ ^^
```
I can now *only* scroll up but not down.

Now for `02`:
```
07 11 02 02 00 00 00 00
         ^^
```
I can still only scroll up, but the scroll direction is reversed. (So I scrolls up and it acts like it scrolls down)

After more testing, it seems that this byte is used for **debugging/QA purposes**, here's a full list of the values that have an effect:  
<small>(Everything shown below can only be triggered by scrolling up, not down)</small>
<table>
  <tr>
    <th>Value</th>
    <th>Action</th>
  </tr>
  <tr>
    <td>01</td><td>Normal scrolling</td>
  </tr>
  <tr>
    <td>02</td><td>Normal scrolling, direction reversed</td>
  </tr>
  <tr>
    <td>03</td><td>Control volume</td>
  </tr>
  <tr>
    <td>04</td><td>Control volume, direction reversed</td>
  </tr>
  <tr>
    <td>06</td><td>Cycle active DPI Profile</td>
  </tr>
  <tr>
    <td>07</td><td>Trigger the <strong>Show Desktop</strong> action</td>
  </tr>
  <tr>
    <td>08</td><td>Toggle RGB Light (On/Off)</td>
  </tr>
  <tr>
    <td>09</td><td>Flash RGB Light</td>
  </tr>
  <tr>
    <td>0b</td><td>Resets the RGB Light breathing animation, starting with Purple.</td>
  </tr>
  <tr>
    <td>0c</td><td>Resets the RGB Light breathing animation, starting with Blue.</td>
  </tr>
  <tr>
    <td>0d</td><td>Spam <code>z</code> key input!</td>
  </tr>
  <tr>
    <td>10</td><td>Flash RGB Light (In Red color)</td>
  </tr>
  <tr>
    <td>11</td><td>Momentarily turn off the RGB Light, then turn it back on again</td>
  </tr>
  <tr>
    <td>12</td><td>Flash RGB Light (In Blue color)</td>
  </tr>
  <tr>
    <td>13</td><td>Flash RGB Light (In Magenta color)</td>
  </tr>
</table>

So I ended up with:
```
07 11 SM DB 00 00 00 00
      ^^ ^^
```

**SM** is the scroll mode. **00** is normal, **01** is to control volume, and **02/03** is for debugging.
**DB** is the debug byte, only have an effect if **SM** is 02/03. *See above for the list.*

# Conclusion
Well it's quite a journey! I hope this blog post won't be a seizure to read due to the sheer length and my inability to formulate sentences.
I won't claim to know the full detail of everything I did (Esp USB-related), but it is still rewarding nevertheless. Feel free to let me know if there's anything wrong or stuff that I missed in the blog post.

All the findings and the program I made to configure the mouse can be found on [my GitHub repo](https://github.com/Kenny-Hui/Instant-A704F-Mouse-Utilities), installation and usage instructions are included in the README.

See you in the next one :3
