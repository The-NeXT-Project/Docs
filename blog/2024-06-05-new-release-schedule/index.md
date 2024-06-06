---
slug: new-release-schedule
title: New Release Schedule
authors: [cat]
tags: [release]
---

Start with version 24.0.0, we will begin to shift from the old "trimonthly" mega release model, which contains many bugfixes and new features but also may cause some important fixes to be delayed up to 3 months or more, to a new "move fast" and "fix fast" model, here is a diagram explain our new version mechanism:

![NeXT Version Diagram](./next-version.svg)

Each feature version may contain 2-3 new feature/refactor/style design changes, and if there is no high-priority bug found after each feature release is published, then the bugfix version will be skipped and development will be moved to the next feature version. We also added more automation to the release publication process, simplified the workflow, and reduced the complexity, we believe this change will help us add more important that may be hard to do in the old release model.

In the future we look forward to applying this release model to all of NeXT Panel projects, but with a more traditional semantic versioning scheme instead of release year-based rolling versioning.
