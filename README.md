# RunViewer 

[![Screen_Shot_2018-01-17_at_19.54.08.png](https://s13.postimg.cc/q6p3gmiw7/Screen_Shot_2018-01-17_at_19.54.08.png)](https://postimg.cc/image/qw7vszjfn/)

Running App prototype developed as part of an HCI module. Allows for users to upload a GPX file and receive a detailed summary of their run, with achievements and statistics

## Requirements

- `Python 3`
- `Django 1.11`

## How To Run
- `python manage.py runserver`
- From there, navigate through login screen to find yourself at the main page.


# Features

## Map

[![Screen_Shot_2018-01-17_at_20.13.40.png](https://s13.postimg.cc/dhzeaqk5z/Screen_Shot_2018-01-17_at_20.13.40.png)](https://postimg.cc/image/8jbvw7gcz/)

The map is the central focus of the page. Large and in the way - for good reason. The map is built off the Google Maps API, yet altered in such a way that statistics and route are discernible at a quick glance. The top-right corner displays a legend containing different workout intensities, calculated using `0mp/h - 5mp/h walking`, `5mp/h - 6mp/h jogging` and `6mp/h+ running`, these colours are further displayed on the route to see where progress needs to be made.

## Statistics

[![Screen_Shot_2018-01-17_at_19.57.58.png](https://s13.postimg.cc/zehbxi5fr/Screen_Shot_2018-01-17_at_19.57.58.png)](https://postimg.cc/image/v5clvc26b/)

View the statistics of your currently selected GPX file, whether that be the number of calories you have burned, average speed, or workout intensity.

## Achievements 

[![Screen_Shot_2018-01-17_at_19.58.28.png](https://s13.postimg.cc/npdc9korr/Screen_Shot_2018-01-17_at_19.58.28.png)](https://postimg.cc/image/zehbxjfqb/)

Throughout your lifetime of using the application, achievements will be unlocked and goals can be met. The achievements make use of the statistics calculated above. Achievements include the most calories you have ever burned on a run (shown in the form of Kit Kats), running a marathon and maintaining a consistent running pace for set durations.

## Comparison

[![Screen_Shot_2018-01-17_at_19.59.08.png](https://s13.postimg.cc/6c31uqobr/Screen_Shot_2018-01-17_at_19.59.08.png)](https://postimg.cc/image/u32fcuoir/)

The comparison section allows for users to easily change between GPX files being viewed, once the GPX file has been viewed, it will forever stay there, and users can always navigate between multiple for measuring workout progress.

