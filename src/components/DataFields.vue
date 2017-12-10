<template>
  <div>
    <div v-for="(field, index) in value">
      <v-text-field
        label="Key"
        :value="field.key"
        ref="fieldKeys"
        @input="updateFieldKey(index)"
      ></v-text-field>
      <v-select
        v-bind:items="data_types"
        item-text="text"
        item-value="value"
        label="Type"
        :value="field.type"
        ref="fieldTypes"
        @input="updateFieldType(index)"
      ></v-select>
      <v-btn flat icon color="red" @click="remove(index)">
        <v-icon>delete</v-icon>
      </v-btn>
    </div>
    <v-btn @click="add">Add Field</v-btn>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data() {
      return {
        fields: [],
        data_types: [
          {text: 'String', value: 'string'},
          {text: 'Integer', value: 'int'},
          {text: 'Float', value: 'float'},
          {text: 'Boolean', value: 'boolean'}
        ]
      }
    },
    methods: {
      updateFieldKey(index) {
        var copy = this.value.slice();
        copy[index]["key"] = this.$refs.fieldKeys[index].inputValue;
        this.$emit('input', copy);
      },
      updateFieldType(index) {
        var copy = this.value.slice();
        copy[index].type = this.$refs.fieldTypes[index].inputValue;
        this.$emit('input', copy);
      },
      add() {
        this.$emit('add', {key: "", type: ""})
      },
      remove(index) {
        this.$emit('remove', index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
