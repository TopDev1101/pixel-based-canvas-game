class Noun{
    constructor( singularPlain, pluralPlain, singularPosessive, pluralPosessive ){
        this.singularPlain = singularPlain;
        this.pluralPlain = pluralPlain || `${singularPlain}s`;
        this.singularPosessive = singularPosessive || `${singularPosessive}'s`;
        this.pluralPosessive = pluralPosessive || `${singularPosessive}s'`;
    }
}