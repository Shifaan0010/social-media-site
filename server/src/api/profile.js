import User from '../models/user.js';

const get_profile = async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    if (user != null) {
        // console.log(`Get api/profile/${req.params.username}`);
        res.send({
            username: user.username,
            displayName: user.displayName,
            description: user.description,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        });
    } else {
        res.status(404).send({ status: 'Failed' });
    }
};

const update_profile = async (req, res) => {
    const user = await User.findOne({
        username: res.locals.token_data.username,
    });

    const updates = Object.assign(
        {},
        req.body.displayName ? { displayName: req.body.displayName } : null,
        req.body.description ? { description: req.body.description } : null
    );
    // console.log('Update', res.locals.token_data.username, updates);

    await user.updateOne(updates);

    res.send({ status: 'Success' });
};

const follow = async (req, res) => {
    const user = await User.findOne({
        username: res.locals.token_data.username,
    });
    const user_to_follow = await User.findOne({
        username: req.body.username,
    });

    // console.log('follow', user?.username, user_to_follow?.username);

    if (user == null || user_to_follow == null) {
        res.status(400).send({
            status: 'Failed',
            reason: 'Invalid username',
        });
    } else {
        user.following.addToSet(user_to_follow);
        user_to_follow.followers.addToSet(user);

        user.save();
        user_to_follow.save();

        res.send({ status: 'Success' });
    }
};

const unfollow = async (req, res) => {
    const user = await User.findOne({
        username: res.locals.token_data.username,
    });
    const user_to_unfollow = await User.findOne({
        username: req.body.username,
    });

    // console.log('unfollow', user?.username, user_to_unfollow?.username);

    if (user == null || user_to_unfollow == null) {
        res.status(400).send({
            status: 'Failed',
            reason: 'Invalid username',
        });
    } else {
        user.following.pull(user_to_unfollow);
        user_to_unfollow.followers.pull(user);

        user.save();
        user_to_unfollow.save();

        res.send({ status: 'Success' });
    }
};

export { get_profile, update_profile, follow, unfollow };
