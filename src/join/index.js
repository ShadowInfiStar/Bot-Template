const validator = require('@dawalters1/wolf.js').Validator;

module.exports = async (api, command)=>{

    if(command.sourceSubscriberId !== api.config.app.developerId){
        return await api.messaging().sendMessage(
            command,
            api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_error_not_privileged_message`),
                {
                    nickname: (await api.subscriber().getById(command.sourceSubscriberId)).nickname,
                    subscriberId: command.sourceSubscriberId
                }));
    }

    if(!command.argument){
        return await api.messaging().sendMessage(
            command,
            api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_join_error_provide_group_id_message`),
                {
                    nickname: (await api.subscriber().getById(command.sourceSubscriberId)).nickname,
                    subscriberId: command.sourceSubscriberId
                }));
    }


    const args = command.argument.split(/[,،]/g);

    if(validator.isValidNumber(args[0])&&!validator.isLessThanOrEqualZero(args[0])) {
        const result = await api.group().joinById(parseInt(args[0]), args[1]);

        if (result.success) {
            return await api.messaging().sendMessage(
                command,
                api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_joined_message`),
                    {
                        nickname: (await api.subscriber().getById(command.sourceSubscriberId)).nickname,
                        subscriberId: command.sourceSubscriberId
                    }));
        } else {
            return await api.messaging().sendMessage(
                command,
                api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_join_error_message`),
                    {
                        nickname: (await api.subscriber().getById(command.sourceSubscriberId)).nickname,
                        subscriberId: command.sourceSubscriberId,
                        error: result.headers && result.headers.message ? result.headers.message : api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_error_unknown_reason_message`)
                    }));
        }
    }

    return await api.messaging().sendMessage(
        command,
        api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_join_error_invalid_argument_message`),
            {
                nickname: (await api.subscriber().getById(command.sourceSubscriberId)).nickname,
                subscriberId: command.sourceSubscriberId,
                arg: args[0]
            }));
}