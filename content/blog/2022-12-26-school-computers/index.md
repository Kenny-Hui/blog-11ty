---
title:  School computers
description: I love school computers!
date: 2022-12-26
# cover-img: /assets/img/path.jpg
# thumbnail-img: /assets/img/thumb.png
thumbnail-img: /assets/img/school_pc_thumb.jpg
tags:
  - software
  - school
---
If you are a computer nerd like me, chances are you have messed around with school's computer and see what you can do with it.

This is just going to be a blog talking about things I've done with school computers during my time studying.

## Primary / Elementary School
I started falling in love with computers back in year 4, especially the Windows side of things, all simply because of a [Windows error remix](https://www.youtube.com/watch?v=D3-vBBQKOYU).
Back then I don't have my own computer, then I found something called a Virtual Machine that allows you to emulate different system. My parents was kind enough to let me setup my own Windows XP VM, and I've learnt alot during the process.

In the computer lab, I would just set the theme from the ugly classic theme my school set to Windows XP's Luna theme and think like I am dealing drugs or something lol. Occasionally I would grab other people's attention, but nothing more than that.

## Secondary / High School
### Year 1
At this point I was basically very obsessed with operating system.

The computer lab runs on like first-gen i7 or something along with Win10, and I was initially very excited.

...until I realized they did not enable administrator. (Which is the proper thing to do)

I can't really do anything about it, but on the library there are ~5 computers running Windows XP. A brief look of the specs reveals that it's a pentium 4 machine with 2GB of RAM.

These thing are slow, very slow, so I thought that destroying them would be a better use than just leaving it alone!

So one by one I used different method to render the OS unbootable, whether that's by deleting registries, bootloader or System32.

Like what are the odds they could catch us anyway, the computer will remain normal until they reboot, and by then I am already out of the library!

Turns out a device called CCTV exist.

Also, there are 1 instances where I was deleting registries and the computer suddenly hard reset, and it no longer boots.

Behind me is a student who is queuing up for using this PC because I've literally destroyed the other 4 computer, and now I destroyed the remaining one infront of him.

So I just uh <i>casually talk to my friend about this and left the library</i>.

One day later my parents said that the IT department called him, stating that I destroyed the library computer and they have to restore the image. My parent didn't really believe that I would do that, and I obviously did not admit that I destroyed it, and things just ends there. My class teacher are a bit pissed off, but I didn't really receive any punishment for that.

### Year 2
I started taking advantages of breaks between lessons and started doing dumb things like forkbomb on the classroom's computer. (These classroom computers are still running the good old trusty Windows XP, so forkbomb is rather easy to stop)

Funny enough they actually do not have CCTV installed on the classroom, so I didn't really get caught or anything, and I did not do anything permanent to the PC. It's a rather uneventful year.

### Year 3
At this point I am more in the programming side of stuff and lost interest in just "bricking computers".

The class teacher of the 3rd year decided to replace the old XP classroom computer to his own computer which is a 16GB win10 machines, even as to claiming that "<i>The amount of RAM this PC has is 8 classroom computer combined together!</i>". But at this point I already have my own 16GB machine at my home. He's not wrong, but it's really nothing impressive about it.

It's also worth noting that the class teacher himself setup the machine, so the default account is not locked down and I can do whatever I want.

One thing I did notice is that the command prompt for mapping network drive appears on log-in (Where as in other PC does not, although the drive still end up getting mapped anyway), I was intrigued by it, and I started looking deeper to the drive. It's a collection of folders stored by different teacher, some of them even have homework answers in it. I quickly uploaded to my Google Drive account during the breaks. Slowly but surely I've got into the habit of uploading literally anything on that network drive to my school's Google Drive account. (Which has unlimited storage, well at least before Google started killing it off).

Another thing I noticed is that the class teacher treat this as more of his personal computer than anything else, even as to connecting his OneDrive account to the computer. I took a peak at his OneDrive and noticed that there is a network drive batch file that connects to several other hidden network location, which contains even more homework answers.

Besides since I now have admin power, I created another Windows user account to upload all the data on that drive in the background during lessons. This is a massive time-save and at one point I racked up around 4TB of data. (Obviously with some duplicated as I upload periodically)

It's pretty nice but I was hoping one day at least 1 teacher would upload the exam paper answer to the network drive, then I could have a peak at it.

Fast-forwarding to just days before the last exam of the year, that moment finally arrived. An English teacher uploaded the exam answer for G.E paper and I immediately uploaded it to google drive and shared with my friends.

My friends are a little bit skeptical, thinking this is too good to be true and didn't bother (And their result are better than me anyway so it doesn't matter). However I still memorized the answer of at least the first page. On the day of the exam, that effort pays off as it is exact same paper. I got the highest mark of the entire class (Although still pretty low, only around ~70/100), and I was happy and guilty at the same time.

^ So if you're a school IT Admin, or just a teacher reading this for whatever reason, please just use a USB.

Anyways after that I am still bored. I then have an idea to downloaded [Intel Extreme Tuning Utility (XTU)](https://www.intel.com/content/www/us/en/download/17881/intel-extreme-tuning-utility-intel-xtu.html) and dragged the clock speed of the classroom PC all the way down to 800Mhz.

{% image "./XTU_800.jpg", "Intel Extreme Tuning Utility UI" %}

I did this right before the History lesson starts, which is the lesson I probably hate the most. The History teacher ended up waiting 3 and a half minute just to open a photo with the Photo app, it was almost the most powerful and disruptive thing I could've done on every lesson. But I know I can't keep that rolling forever, someone will eventually find out so I just raised the clock speed back to normal. (In-fact it took me around 30 minute just to set it back to the normal speed)

Anyways at that point I am still thinking what to do in the next year, but I don't reakky have to worry as the last moment I just switched to a vocational education school. (That obviously expertise in Information Technology, given how much of a nerd I am)

## A fresh start
Arriving at the "new" school, I was finally greeted with reasonable computer specs and software. These computers are connected to a domain controller, and the system would be restored everytime the computer boots. Again the user account do have access to administrator privilege, however due to the large amount of professional software installed on the machine that often updates itself, it's not unreasonable to grant it administrator privilege.

But obviously nothing is bullet proof. For one, there is a hosts files that prevents student from watching youtube or stuff like that, but with admin privilege it has became more easier than ever to just delete it, and now you can watch youtube.

The task manager is disabled by a classroom management program called "**Lanschool**". When the teacher client starts, it automatically locks the student's access to the task manager and several other stuff. However we often power our computer on before the teacher arrives, and Lanschool will not kill the task manager that is already opened. So we can use that and terminate the Lanschool program, now we have total control.

Another method is discovered later to just run `taskkill /F /IM student.exe` to terminate Lanschool even with it being turned on, then editing group policy to re-enable task manager.

However I didn't really do this for long. For one it's just annoying? Surely I have better stuff to do than terminating this everytime the lesson starts.

Second I don't really see the benefit of killing it. I no longer have the interest to do stuff that is against the teacher's/school's rules. And the things they are teaching is rather essential, I usually just pay attention whenever I can.

### Year 2
Now that I know these computers are all "connected", I found out I can command a remote shutdown/restart to anyone, And I can also use msg/psexec to remotely run programs.

I only did some msgbox for testing, nothing harmful. There's also not alot of free time I could mess around, and I have no reason to not pay attention to the lesson as they all seems to interest me.

### Year 3
This is the final year. And there is an computer lessons that just teaches you basic office work and stuff. It's very boring, but at the same time that leaves me with alot of free time.

I am still intrigued by the ability to remotely execute programs, but the IT Department probably knows about this and they finally turned off Remote Desktop this year.

I can still shutdown remotely, but nothing more than that. However I soon discovered that you can use the default Windows Task Scheduler to remotely schedule commands, but I couldn't get it to work no matter what.

Until ~2 weeks ago as of writing this, I was watching through a [YouTube video](https://www.youtube.com/watch?v=K4WkdvZ2948) sharing his tech stories at school (Great video btw).

I saw [this comments (In the highlighted comments section)](https://www.youtube.com/watch?v=K4WkdvZ2948&lc=Ugy_iINUwWM-Op733pZ4AaABAg):

Someone apparently downloaded the very same classroom software that their school uses, so they have the teacher client and are able to take control of others computer.
I thought you can only bypass it in some really ancient and badly maintained classroom software and I didn't thought much about it at the time.

Eventually it got me wondering can I do the same. But I can't download the classroom software (Lanschool) my school uses. My school is 1 major version behind, and I am very uncertain whether that will work.

In addition I am just against trialware, and given Lanschool is maintained by Lenovo, surely they won't just give you access because you're on the same network right?

But what if I can copy the client from the teacher's PC? I know I have to find a way to remotely execute some command on their end so I can obtain the file. I quickly realized the whole time I was scheduling the task with the wrong log-in credentials and that's why it did not run the task.

So I switched to use an local account called `kfstud` which is setup by the school, presumably in the case where it can't connect to the domain, and now I can finally remotely schedule tasks!

I still think that it won't be as simple as copying the binaries. There is only 2 lessons left, and I want to at least get something out of it.

As a compromise I decided to not push my luck, but going to the safer and less impressive approach of viewing and taking control the teacher's PC. That means I would remotely download TightVNC Server to the teacher's PC, install it, then I can connect without raising suspicion.

This ought to be a faster and more reliable approach that would guarentee success, but well this failed hard probably due to some powershell security policy Microsoft implemented, as such I can't even download anything on their end, I've spent the entire lesson trying to get this work but nope.

At last I decided to just take a gamble and hope the teacher client will work on my student PC. It's the last lesson anyway, what could I possibily lose?

Now I need to somehow get it transferred to my computer. My first thought is to copy the Lanschool Program to the network drive (Which is used to hand in homework remotely), then I can obtain it.

But the account I uses to schedule (kfstud) does not have the network drive mapped, so I can't do that. I soon figured out that you can share a folder in Windows and it will create a network share that anyone can access.

So I created a new folder and started sharing it. Then I schedule the copy command on teacher's PC and copied the Lanschool folder (`C:\Program Files(x86)\LanSchool`) to my shared folder.

{% image "./lsk.jpg", "Lanschool Teacher Client, captured at that day" %}

And it actually worked! There's no password or anything either, I can even archive the teacher binaries and it will still work.

This is probably my biggest discovery (At least at this school). Sure it's not like I have to do any hacking 101 or any network sniffing to get it working, and there are almost no barriers preventing me apart from some Windows knowledge. But in the end I am still quite happy about it, just having the teacher client running infront of you feels different.

Unfortunately it is the last lesson. Looking over my remaining course I can only find 1 computer related course, and it's not even held in any computer lab.

So that is how it has to end.

Looking over this again, I can't help but notice that I often do bad stuff with bad intentions on the old school, although it probably make sense given how I gives 0 sh*t to almost any lessons.
