<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink } from 'vue-router'
    import { useRouter } from 'vue-router'
    import RetrieveView from '../views/Retrieve.vue'

    const messageText = ref();
    const messagePublicId = ref();
    const messageKey = ref();

    const router = useRouter();
    router.addRoute({
        path: '/retrieve',
        name: 'retrieve',
        component: RetrieveView
    });

    async function createMessageHanle(message: any) {
        const response = await fetch('http://localhost:3000/message/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: messageText.value.value
            }),
        });
        const body = await response.json() as {
            success: boolean
            publicId: string
            key: string
        }
        messagePublicId.value = body.publicId;
        messageKey.value = body.key;
    }
</script>

<template>
    <section id="create-message">
        <div class="form-item">
            <span>Enter your message:</span>
            <input ref="messageText" value="My secret message!">
        </div>
        <button @click="createMessageHanle">Encrypt</button>
        <div v-if="messagePublicId" class="retrieve-url">
            Url to retrieve the message:
            <RouterLink :to="{
                    name: 'retrieve',
                    query: {
                        publicId: messagePublicId,
                        key: messageKey,
                    }
            }">
                Click to retrieve the message
            </RouterLink>
        </div>
    </section>
</template>

<style>
    #create-message {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
    #create-message .form-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    #create-message .retrieve-url {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>