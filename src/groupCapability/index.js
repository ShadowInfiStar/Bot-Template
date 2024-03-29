const {capability} = require('@dawalters1/constants');

/**
 * Required for intellisense to work with api & command
 * @param {import('@dawalters1/wolf.js').WOLFBot} api
 * @param {import('@dawalters1/wolf.js').CommandObject} command
 */
module.exports = async (api, command) => {
    
    if(!await api.utility().group().member().checkPermissions(command.targetGroupId, command.sourceSubscriberId, capability.MOD)){
        return await api.messaging().sendGroupMessage(command.targetGroupId, 
            api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_error_capability_mod+`),
            {
                nickname: subscriber.nickname,
                subscriberId: subscriber.id
            }));
    }
    
    const subscriber = await api.subscriber().getById(command.sourceSubscriberId);
    
    return await api.messaging().sendGroupMessage(command.targetGroupId, 
        api.utility().string().replace(api.phrase().getByLanguageAndName(command.language, `${api.config.keyword}_group_capability_message`),
        {
            nickname: subscriber.nickname,
            subscriberId: subscriber.id
        }));
}